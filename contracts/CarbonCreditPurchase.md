``` solidity
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

    // Function for farmer to handle purchase request
    function handlePurchaseRequest(
        address _buyer,
        uint256 _requestIndex,
        bool _approve
    ) external {
        PurchaseRequest storage request = purchaseRequests[_buyer][_requestIndex];
        require(request.farmer == msg.sender, "Not authorized");
        require(request.status == 0, "Request already handled");

        if (_approve) {
            // Transfer tokens from farmer to buyer
            carbonCreditContract.safeTransferFrom(
                msg.sender,
                _buyer,
                request.tokenId,
                request.amount,
                ""
            );
            request.status = 1; // Approved
        } else {
            request.status = 2; // Rejected
        }

        emit PurchaseRequestHandled(
            _buyer,
            msg.sender,
            request.tokenId,
            request.amount,
            request.status,
            _requestIndex
        );
    }

    // Function to get purchase request details
    function getPurchaseRequest(
        address _buyer,
        uint256 _requestIndex
    ) external view returns (
        address buyer,
        address farmer,
        uint256 tokenId,
        uint256 amount,
        uint256 status,
        uint256 timestamp
    ) {
        PurchaseRequest memory request = purchaseRequests[_buyer][_requestIndex];
        return (
            request.buyer,
            request.farmer,
            request.tokenId,
            request.amount,
            request.status,
            request.timestamp
        );
    }

    // Function to get all purchase requests for a buyer
    function getBuyerPurchaseRequests(
        address _buyer
    ) external view returns (
        uint256[] memory indices,
        address[] memory farmers,
        uint256[] memory tokenIds,
        uint256[] memory amounts,
        uint256[] memory statuses,
        uint256[] memory timestamps
    ) {
        uint256 count = nextRequestIndex[_buyer];
        indices = new uint256[](count);
        farmers = new address[](count);
        tokenIds = new uint256[](count);
        amounts = new uint256[](count);
        statuses = new uint256[](count);
        timestamps = new uint256[](count);

        for (uint256 i = 0; i < count; i++) {
            PurchaseRequest memory request = purchaseRequests[_buyer][i];
            indices[i] = i;
            farmers[i] = request.farmer;
            tokenIds[i] = request.tokenId;
            amounts[i] = request.amount;
            statuses[i] = request.status;
            timestamps[i] = request.timestamp;
        }

        return (indices, farmers, tokenIds, amounts, statuses, timestamps);
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
        uint256 count = nextFarmerRequestIndex[_farmer];
        indices = new uint256[](count);
        buyers = new address[](count);
        tokenIds = new uint256[](count);
        amounts = new uint256[](count);
        statuses = new uint256[](count);
        timestamps = new uint256[](count);

        uint256 currentIndex = 0;
        for (uint256 i = 0; i < count; i++) {
            PurchaseRequest memory request = purchaseRequests[msg.sender][i];
            if (request.farmer == _farmer) {
                indices[currentIndex] = i;
                buyers[currentIndex] = request.buyer;
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
```