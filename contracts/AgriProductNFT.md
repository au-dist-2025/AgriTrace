``` solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract AgriProductNFT is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    enum SupplyChainStage {
        FARMER,
        TRANSPORTER,
        WAREHOUSE,
        RETAILER
    }

    // Self-registration mappings for all roles
    mapping(address => bool) public farmers;
    mapping(address => bool) public transporters;
    mapping(address => bool) public warehouses;
    mapping(address => bool) public retailers;

    struct TraceRecord {
        address actor;
        uint256 timestamp;
        string metadataCID;
        SupplyChainStage stage;
    }

    mapping(uint256 => TraceRecord[]) public productHistory;
    mapping(uint256 => SupplyChainStage) public currentStage;
    mapping(uint256 => string) private _tokenURIs;

    constructor() ERC721("AgriProduct", "AGRI") {}

    // Self-registration functions for all roles
    // function registerAsFarmer() external {
    //     farmers[msg.sender] = true;
    // }

    // function registerAsTransporter() external {
    //     transporters[msg.sender] = true;
    // }

    // function registerAsWarehouse() external {
    //     warehouses[msg.sender] = true;
    // }

    // function registerAsRetailer() external {
    //     retailers[msg.sender] = true;
    // }

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes memory _data
    ) public virtual override {
        _verifyTransfer(from, to, tokenId);
        super.safeTransferFrom(from, to, tokenId, _data);
    }

    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public virtual override {
        _verifyTransfer(from, to, tokenId);
        super.transferFrom(from, to, tokenId);
    }

    function _verifyTransfer(address, address to, uint256 tokenId) internal view {
        address owner = ownerOf(tokenId);
        address sender = _msgSender();
        require(
            sender == owner || 
            getApproved(tokenId) == sender || 
            isApprovedForAll(owner, sender),
            "Transfer caller is not owner nor approved"
        );

        SupplyChainStage stage = currentStage[tokenId];
        if (stage == SupplyChainStage.FARMER) {
            require(transporters[to], "Recipient must be transporter");
        } else if (stage == SupplyChainStage.TRANSPORTER) {
            require(warehouses[to], "Recipient must be warehouse");
        } else if (stage == SupplyChainStage.WAREHOUSE) {
            require(retailers[to], "Recipient must be retailer");
        }
    }

    function mintProduct(
        string memory _tokenURI,
        string memory farmerDataCID
    ) external returns (uint256) {
        require(farmers[msg.sender], "Caller is not registered farmer");
        
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        
        _mint(msg.sender, newItemId);
        _tokenURIs[newItemId] = _tokenURI;
        
        productHistory[newItemId].push(TraceRecord({
            actor: msg.sender,
            timestamp: block.timestamp,
            metadataCID: farmerDataCID,
            stage: SupplyChainStage.FARMER
        }));
        
        currentStage[newItemId] = SupplyChainStage.FARMER;
        return newItemId;
    }

    function addTransportData(uint256 tokenId, string memory metadataCID) external {
        require(transporters[msg.sender], "Caller is not registered transporter");
        require(ownerOf(tokenId) == msg.sender, "Not current owner");
        require(currentStage[tokenId] == SupplyChainStage.FARMER, "Invalid stage");
        
        productHistory[tokenId].push(TraceRecord({
            actor: msg.sender,
            timestamp: block.timestamp,
            metadataCID: metadataCID,
            stage: SupplyChainStage.TRANSPORTER
        }));
        
        currentStage[tokenId] = SupplyChainStage.TRANSPORTER;
    }

    function addWarehouseData(uint256 tokenId, string memory metadataCID) external {
        require(warehouses[msg.sender], "Caller is not registered warehouse");
        require(ownerOf(tokenId) == msg.sender, "Not current owner");
        require(currentStage[tokenId] == SupplyChainStage.TRANSPORTER, "Invalid stage");
        
        productHistory[tokenId].push(TraceRecord({
            actor: msg.sender,
            timestamp: block.timestamp,
            metadataCID: metadataCID,
            stage: SupplyChainStage.WAREHOUSE
        }));
        
        currentStage[tokenId] = SupplyChainStage.WAREHOUSE;
    }

    function addRetailerData(uint256 tokenId, string memory metadataCID) external {
        require(retailers[msg.sender], "Caller is not registered retailer");
        require(ownerOf(tokenId) == msg.sender, "Not current owner");
        require(currentStage[tokenId] == SupplyChainStage.WAREHOUSE, "Invalid stage");
        
        productHistory[tokenId].push(TraceRecord({
            actor: msg.sender,
            timestamp: block.timestamp,
            metadataCID: metadataCID,
            stage: SupplyChainStage.RETAILER
        }));
        
        currentStage[tokenId] = SupplyChainStage.RETAILER;
    }

    function getProductHistory(uint256 tokenId) public view returns (TraceRecord[] memory) {
        return productHistory[tokenId];
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        return _tokenURIs[tokenId];
    }

    // Add this modifier to prevent multiple registrations
modifier onlyUnregistered() {
    require(
        !farmers[msg.sender] &&
        !transporters[msg.sender] &&
        !warehouses[msg.sender] &&
        !retailers[msg.sender],
        "Already registered in another role"
    );
    _;
}

// Update all registration functions with the modifier
function registerAsFarmer() external onlyUnregistered {
    farmers[msg.sender] = true;
}

function registerAsTransporter() external onlyUnregistered {
    transporters[msg.sender] = true;
}

function registerAsWarehouse() external onlyUnregistered {
    warehouses[msg.sender] = true;
}

function registerAsRetailer() external onlyUnregistered {
    retailers[msg.sender] = true;
}
}
```