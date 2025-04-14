// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CarbonCreditPurchase is Ownable {
    struct PurchaseRequest {
        address buyer;
        address farmer;
        uint256 tokenId;
        uint256 amount;
        uint256 status; // 0: Pending, 1: Approved, 2: Rejected
        uint256 timestamp;
    }

    // Mapping to store purchase requests
    mapping(address => mapping(uint256 => PurchaseRequest)) public purchaseRequests;
    // Mapping to store the next index for each buyer
    mapping(address => uint256) public nextRequestIndex;
    // Mapping to store the next index for each farmer
    mapping(address => uint256) public nextFarmerRequestIndex;
    // Mapping to store all buyers for each farmer
    mapping(address => address[]) public farmerBuyers;
    // Mapping to store the request indices for each buyer-farmer pair
    mapping(address => mapping(address => uint256[])) public farmerBuyerRequests;

    // Events
    event PurchaseRequestCreated(
        address indexed buyer,
        address indexed farmer,
        uint256 tokenId,
        uint256 amount,
        uint256 requestIndex
    );
    event PurchaseRequestHandled(
        address indexed buyer,
        address indexed farmer,
        uint256 tokenId,
        uint256 amount,
        uint256 status,
        uint256 requestIndex
    );

    // Reference to the main carbon credit contract
    IERC1155 public carbonCreditContract;

    constructor(address _carbonCreditContract) Ownable(msg.sender) {
        carbonCreditContract = IERC1155(_carbonCreditContract);
    }

    // Function to create a purchase request
    function createPurchaseRequest(
        address _farmer,
        uint256 _tokenId,
        uint256 _amount
    ) external {
        require(_farmer != address(0), "Invalid farmer address");
        require(_amount > 0, "Amount must be greater than 0");

        uint256 requestIndex = nextRequestIndex[msg.sender];
        purchaseRequests[msg.sender][requestIndex] = PurchaseRequest({
            buyer: msg.sender,
            farmer: _farmer,
            tokenId: _tokenId,
            amount: _amount,
            status: 0, // Pending
            timestamp: block.timestamp
        });

        // Add buyer to farmer's list if not already present
        if (farmerBuyerRequests[_farmer][msg.sender].length == 0) {
            farmerBuyers[_farmer].push(msg.sender);
        }
        
        // Add request index to buyer-farmer pair
        farmerBuyerRequests[_farmer][msg.sender].push(requestIndex);

        nextRequestIndex[msg.sender]++;
        nextFarmerRequestIndex[_farmer]++;

        emit PurchaseRequestCreated(
            msg.sender,
            _farmer,
            _tokenId,
            _amount,
            requestIndex
        );
    }

    // Function to get all purchase requests for a farmer
    function getFarmerPurchaseRequests(
        address _farmer
    ) external view returns (
        uint256[] memory indices,
        address[] memory buyers,
        uint256[] memory tokenIds,
        uint256[] memory amounts,
        uint256[] memory statuses,
        uint256[] memory timestamps
    ) {
        // Get all buyers for this farmer
        address[] memory buyersList = farmerBuyers[_farmer];
        uint256 totalRequests = 0;

        // Count total requests
        for (uint256 i = 0; i < buyersList.length; i++) {
            totalRequests += farmerBuyerRequests[_farmer][buyersList[i]].length;
        }

        // Initialize arrays with the correct size
        indices = new uint256[](totalRequests);
        buyers = new address[](totalRequests);
        tokenIds = new uint256[](totalRequests);
        amounts = new uint256[](totalRequests);
        statuses = new uint256[](totalRequests);
        timestamps = new uint256[](totalRequests);

        // Fill the arrays with matching requests
        uint256 currentIndex = 0;
        for (uint256 i = 0; i < buyersList.length; i++) {
            address buyer = buyersList[i];
            uint256[] memory requestIndices = farmerBuyerRequests[_farmer][buyer];
            
            for (uint256 j = 0; j < requestIndices.length; j++) {
                PurchaseRequest memory request = purchaseRequests[buyer][requestIndices[j]];
                indices[currentIndex] = requestIndices[j];
                buyers[currentIndex] = buyer;
                tokenIds[currentIndex] = request.tokenId;
                amounts[currentIndex] = request.amount;
                statuses[currentIndex] = request.status;
                timestamps[currentIndex] = request.timestamp;
                currentIndex++;
            }
        }

        return (indices, buyers, tokenIds, amounts, statuses, timestamps);
    }
} 