# AgriTrace: Decentralized Carbon Credit and Agricultural Traceability System

## Abstract
This is a decentralized application (dApp) that combines two major functionalities: agricultural product traceability and carbon credit management. Built on blockchain technology, it provides a transparent, secure, and efficient platform for farmers, auditors, and buyers to interact in the carbon credit market while ensuring agricultural product authenticity.

## Core Features

### 1. Carbon Credit Management System
- **Farmer Registration**: Farmers can register with their details including ID, name, experience, land size, and location
- **Auditor Registration**: Certified auditors can register to verify carbon credit claims
- **Carbon Credit Claims**: Farmers can claim carbon credits by submitting environmental impact reports
- **Credit Verification**: Auditors verify the authenticity of carbon credit claims
- **NFT Minting**: Verified carbon credits are minted as NFTs with unique metadata
- **Marketplace**: Carbon credits can be bought and sold in a decentralized marketplace

### 2. Agricultural Product Traceability
- **Product Registration**: Farmers can register their agricultural products
- **Supply Chain Tracking**: Complete traceability of products from farm to consumer
- **Quality Verification**: Auditors can verify product quality and authenticity
- **NFT Representation**: Products are represented as NFTs with detailed metadata

## Technical Architecture

### Smart Contracts
1. **CarbonCreditSystem.sol**
   - Manages farmer and auditor registration
   - Handles carbon credit claims and verification
   - Mints carbon credits as NFTs
   - Tracks credit ownership and transfers

2. **CarbonCreditPurchase.sol**
   - Manages the carbon credit marketplace
   - Handles purchase requests and approvals
   - Facilitates secure token transfers
   - Maintains transaction history

3. **AgriProductNFT.sol**
   - Manages agricultural product registration
   - Handles product verification
   - Mints product NFTs
   - Tracks product ownership and transfers

### Frontend Application
- Built with Next.js and React
- Modern UI with Tailwind CSS
- Responsive design for all devices
- Interactive components for:
  - User registration and authentication
  - Carbon credit management
  - Product traceability
  - Marketplace interactions

## Workflow

### Carbon Credit System
1. **Registration Phase**
   - Farmers register with their details
   - Auditors register with their credentials
   - System verifies registration details

2. **Credit Claim Process**
   - Farmer submits carbon credit claim with environmental data
   - Data is stored on IPFS for transparency
   - Auditor reviews and verifies the claim
   - Upon verification, credit is minted as NFT

3. **Marketplace Operations**
   - Buyers browse available carbon credits
   - Purchase requests are created
   - Farmers approve/reject requests
   - Secure token transfer upon approval

### Agricultural Traceability
1. **Product Registration**
   - Farmer registers agricultural product
   - Product details and metadata are stored
   - Unique NFT is minted for the product

2. **Supply Chain Tracking**
   - Each transfer of ownership is recorded
   - Quality checks and verifications are logged
   - Complete history is accessible to all parties

3. **Consumer Verification**
   - End consumers can verify product authenticity
   - Access complete product history
   - View quality certifications and verifications

## Technical Requirements
- Node.js (v16 or higher)
- npm or yarn
- MetaMask or compatible Web3 wallet
- Access to an Ethereum-compatible blockchain network

## Setup and Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   - Create `.env.local` file
   - Add required environment variables
4. Start the development server:
   ```bash
   npm run dev
   ```

## Security Features
- Smart contract access control
- Secure token transfers
- IPFS-based data storage
- Transparent verification process
- Immutable transaction records

## Future Enhancements
- Integration with IoT devices for real-time data
- Advanced analytics dashboard
- Mobile application support
- Cross-chain compatibility
- Automated verification systems

## License
MIT License - See LICENSE file for details

AgriNFT contract deployment : https://sepolia.etherscan.io/tx/0x54b3340515297e9dd5f50b1061b9b496f31f7d83111593420ed1dac678b9fb93

## Environment Setup

This project uses environment variables for sensitive information like API keys. To set up your environment:

1. Create a `.env.local` file in the root directory of the project
2. Add the following variables with your actual values:

```
# Pinata API Credentials
NEXT_PUBLIC_PINATA_API_KEY=your_pinata_api_key_here
NEXT_PUBLIC_PINATA_API_SECRET=your_pinata_api_secret_here
```

3. Replace the placeholder values with your actual Pinata API credentials

**Note:** The `.env.local` file is automatically ignored by Git to prevent sensitive information from being committed to the repository.
