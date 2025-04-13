# Setting Up Storacha.network IPFS Access

This guide explains how to properly set up Storacha.network IPFS access for the D-Mandates application.

## Why Storacha.network?

Storacha.network provides a reliable and user-friendly IPFS service with the following benefits:

- **Simple API**: Easy-to-use REST API for IPFS operations
- **Reliable Storage**: Ensures your data remains available on the IPFS network
- **Pinning Service**: Automatically pins your content to prevent garbage collection
- **Gateway Access**: Provides a public gateway to access your IPFS content

## Setting Up Storacha.network

### 1. Create a Storacha.network Account

1. Go to [https://storacha.network/](https://storacha.network/) and sign up for an account
2. Verify your email address

### 2. Generate an API Key

1. Log in to your Storacha.network dashboard
2. Navigate to the "API Keys" section
3. Click "Generate New API Key"
4. Give your key a descriptive name (e.g., "D-Mandates")
5. Copy the generated API key

### 3. Update Environment Variables

1. Open your `.env.local` file
2. Add or update the following variable:

```
NEXT_PUBLIC_STORACHA_API_KEY=your_api_key_here
```

3. Save the file and restart your application

## Verifying Storacha.network Access

To verify that your application has proper IPFS access:

1. Navigate to the IPFS Test page at `/ipfs-test`
2. Enter some test data and click "Upload to IPFS"
3. If successful, you should see:
   - A success message with a CID
   - The status should show "Connected to Storacha.network IPFS"
   - The uploaded item should have a blue "storacha" badge
   - You should be able to click "View on Storacha Gateway" to see your data

## Troubleshooting

If you're seeing connection issues:

1. **Check your API key**: Ensure your Storacha.network API key is correct
2. **Verify API key permissions**: Make sure your API key has the necessary permissions
3. **Check network access**: Ensure your IP address is allowed in the Storacha.network dashboard
4. **Check console errors**: Look for specific error messages in your browser console

## Additional Resources

- [Storacha.network Documentation](https://docs.storacha.network/)
- [IPFS Official Documentation](https://docs.ipfs.tech/)
- [Content Addressing on IPFS](https://docs.ipfs.tech/concepts/content-addressing/) 