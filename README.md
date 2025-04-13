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
