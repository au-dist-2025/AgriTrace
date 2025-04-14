``` solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CarbonCreditSystem is ERC1155, Ownable {
    struct Farmer {
        string farmerId;
        string name;
        uint256 experience;
        uint256 landSize;
        string location;
        bool isRegistered;
    }

    struct Auditor {
        string companyId;
        string name;
        uint256 experience;
        bool isRegistered;
    }

    struct CarbonCreditRequest {
        string ipfsHash; // Store report on IPFS
        uint256 carbonAmount;
        bool isVerified;
        bool isMinted;
        uint256 tokenId; // Store the token ID if minted
    }

    struct CarbonCredit {
        address farmer;
        uint256 amount;
        string ipfsHash;
        bool isActive;
    }

    mapping(address => Farmer) public farmers;
    mapping(address => Auditor) public auditors;
    mapping(address => CarbonCreditRequest[]) public carbonRequests;
    mapping(address => uint256[]) public activeCredits;
    mapping(uint256 => CarbonCredit) public carbonCredits; // Map token ID to credit details
    mapping(uint256 => string) private tokenURIs; // Store NFT metadata dynamically
    mapping(uint256 => bool) public isTokenMinted; // Track if a token ID is already used

    event FarmerRegistered(address indexed farmer, string farmerId);
    event AuditorRegistered(address indexed auditor, string companyId);
    event CreditClaimed(address indexed farmer, string ipfsHash, uint256 amount);
    event CreditVerified(address indexed farmer, uint256 requestIndex);
    event CreditMinted(address indexed farmer, uint256 tokenId, uint256 amount, string metadataUri);

    constructor() ERC1155("") Ownable(msg.sender) {}

    // 🧑‍🌾 Register Farmer
    function registerFarmer(
        string memory _farmerId,
        string memory _name,
        uint256 _experience,
        uint256 _landSize,
        string memory _location
    ) public {
        require(!farmers[msg.sender].isRegistered, "Already Registered");
        require(bytes(_farmerId).length > 0, "Invalid farmer ID");
        require(bytes(_name).length > 0, "Invalid name");
        require(_experience > 0, "Invalid experience");
        require(_landSize > 0, "Invalid land size");
        require(bytes(_location).length > 0, "Invalid location");
        
        farmers[msg.sender] = Farmer(_farmerId, _name, _experience, _landSize, _location, true);
        emit FarmerRegistered(msg.sender, _farmerId);
    }

    // 🏢 Register Auditor
    function registerAuditor(string memory _companyId, string memory _name, uint256 _experience) public {
        require(!auditors[msg.sender].isRegistered, "Already Registered");
        require(bytes(_companyId).length > 0, "Invalid company ID");
        require(bytes(_name).length > 0, "Invalid name");
        require(_experience > 0, "Invalid experience");
        
        auditors[msg.sender] = Auditor(_companyId, _name, _experience, true);
        emit AuditorRegistered(msg.sender, _companyId);
    }

    // 🚜 Farmer Claims Carbon Credits
    function claimCarbonCredit(string memory _ipfsHash, uint256 _amount) public {
        require(farmers[msg.sender].isRegistered, "Not a registered farmer");
        require(bytes(_ipfsHash).length > 0, "Invalid IPFS hash");
        require(_amount > 0, "Invalid amount");
        
        carbonRequests[msg.sender].push(CarbonCreditRequest(_ipfsHash, _amount, false, false, 0));
        emit CreditClaimed(msg.sender, _ipfsHash, _amount);
    }

    // 🔍 Auditor Verifies Carbon Credits
    function verifyCarbonCredit(address _farmer, uint256 _index) public {
        require(auditors[msg.sender].isRegistered, "Only auditors can verify");
        require(_index < carbonRequests[_farmer].length, "Invalid index");
        require(!carbonRequests[_farmer][_index].isVerified, "Already verified");
        
        carbonRequests[_farmer][_index].isVerified = true;
        emit CreditVerified(_farmer, _index);
    }

    // 🪙 Mint Verified Carbon Credit as NFT (with IPFS metadata)
    function mintCarbonCredit(uint256 _index, string memory _metadataUri) public {
        require(farmers[msg.sender].isRegistered, "Not a registered farmer");
        require(_index < carbonRequests[msg.sender].length, "Invalid index");
        require(carbonRequests[msg.sender][_index].isVerified, "Credit not verified");
        require(!carbonRequests[msg.sender][_index].isMinted, "Credit already minted");
        require(bytes(_metadataUri).length > 0, "Invalid metadata URI");

        uint256 tokenId = block.timestamp; // Unique ID
        require(!isTokenMinted[tokenId], "Token ID already used");
        
        uint256 amount = carbonRequests[msg.sender][_index].carbonAmount;

        _mint(msg.sender, tokenId, amount, "");
        tokenURIs[tokenId] = _metadataUri;
        activeCredits[msg.sender].push(tokenId);
        isTokenMinted[tokenId] = true;
        
        // Store credit details
        carbonCredits[tokenId] = CarbonCredit({
            farmer: msg.sender,
            amount: amount,
            ipfsHash: carbonRequests[msg.sender][_index].ipfsHash,
            isActive: true
        });
        
        // Update request status
        carbonRequests[msg.sender][_index].isMinted = true;
        carbonRequests[msg.sender][_index].tokenId = tokenId;

        emit CreditMinted(msg.sender, tokenId, amount, _metadataUri);
    }

    // 📜 Get Metadata URI for a specific token ID
    function uri(uint256 tokenId) public view override returns (string memory) {
        require(isTokenMinted[tokenId], "Token does not exist");
        return tokenURIs[tokenId];
    }

    // 🔍 Get all active credits for a farmer
    function getFarmerActiveCredits(address _farmer) public view returns (uint256[] memory) {
        require(farmers[_farmer].isRegistered, "Farmer not registered");
        return activeCredits[_farmer];
    }

    // 🔍 Get carbon credit details by token ID
    function getCarbonCredit(uint256 _tokenId) public view returns (CarbonCredit memory) {
        require(isTokenMinted[_tokenId], "Token does not exist");
        return carbonCredits[_tokenId];
    }

    // 🔍 Check if a credit is already minted
    function isCreditMinted(address _farmer, uint256 _index) public view returns (bool) {
        require(_index < carbonRequests[_farmer].length, "Invalid index");
        return carbonRequests[_farmer][_index].isMinted;
    }

    // 🔍 Get carbon request details by token ID
    function getCarbonRequestByTokenId(uint256 _tokenId) public view returns (CarbonCreditRequest memory) {
        require(isTokenMinted[_tokenId], "Token does not exist");
        CarbonCredit memory credit = carbonCredits[_tokenId];
        return carbonRequests[credit.farmer][_tokenId];
    }
}
```