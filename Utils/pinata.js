// Pinata IPFS integration
import axios from 'axios';

// Pinata API configuration
const PINATA_API_URL = 'https://api.pinata.cloud';
const PINATA_GATEWAY = 'https://gateway.pinata.cloud/ipfs';

// Default API credentials from environment variables
const DEFAULT_API_KEY = process.env.NEXT_PUBLIC_PINATA_API_KEY || '';
const DEFAULT_API_SECRET = process.env.NEXT_PUBLIC_PINATA_API_SECRET || '';

// Helper function to get authentication headers with Pinata API key and secret
const getAuthHeaders = (apiKey, apiSecret) => {
  return {
    'pinata_api_key': apiKey,
    'pinata_secret_api_key': apiSecret,
    'Content-Type': 'application/json',
  };
};

/**
 * Upload JSON data to IPFS via Pinata
 * @param {Object} data - JSON data to upload
 * @param {string} [apiKey] - Pinata API key (optional, will use env var if not provided)
 * @param {string} [apiSecret] - Pinata API secret (optional, will use env var if not provided)
 * @returns {Promise<string>} - CID of the uploaded content
 */
export const uploadToPinata = async (data, apiKey = DEFAULT_API_KEY, apiSecret = DEFAULT_API_SECRET) => {
  try {
    if (!apiKey || !apiSecret) {
      throw new Error('Pinata API key and secret are required for authentication');
    }

    // Upload to Pinata
    const response = await axios.post(
      `${PINATA_API_URL}/pinning/pinJSONToIPFS`,
      data,
      {
        headers: getAuthHeaders(apiKey, apiSecret),
      }
    );
    
    if (response.status !== 200) {
      throw new Error(`Pinata upload failed: ${response.statusText}`);
    }
    
    const cid = response.data.IpfsHash;
    
    // Store the CID in localStorage for reference
    const storedCIDs = JSON.parse(localStorage.getItem('ipfsCIDs') || '[]');
    storedCIDs.push({
      cid,
      timestamp: new Date().toISOString(),
      name: data.name || 'json-data',
      source: 'pinata',
      apiKey: apiKey.substring(0, 5) + '...' // Store a truncated version for reference
    });
    localStorage.setItem('ipfsCIDs', JSON.stringify(storedCIDs));
    
    return cid;
  } catch (error) {
    console.error('Error uploading to Pinata:', error);
    throw error;
  }
};

/**
 * Fetch JSON data from IPFS using a CID
 * @param {string} cid - Content Identifier
 * @returns {Promise<Object>} - JSON data
 */
export const fetchFromPinata = async (cid) => {
  try {
    // Use Pinata gateway to fetch content
    const response = await axios.get(`${PINATA_GATEWAY}/${cid}`);
    
    if (response.status !== 200) {
      throw new Error(`Pinata fetch failed: ${response.statusText}`);
    }
    
    return response.data;
  } catch (error) {
    console.error('Error fetching from Pinata:', error);
    throw error;
  }
};

/**
 * Pin a CID to ensure it remains available
 * @param {string} cid - Content Identifier to pin
 * @param {string} [apiKey] - Pinata API key (optional, will use env var if not provided)
 * @param {string} [apiSecret] - Pinata API secret (optional, will use env var if not provided)
 * @returns {Promise<boolean>} - Success status
 */
export const pinToPinata = async (cid, apiKey = DEFAULT_API_KEY, apiSecret = DEFAULT_API_SECRET) => {
  try {
    if (!apiKey || !apiSecret) {
      throw new Error('Pinata API key and secret are required for authentication');
    }

    const response = await axios.post(
      `${PINATA_API_URL}/pinning/pinByHash`,
      { hashToPin: cid },
      {
        headers: getAuthHeaders(apiKey, apiSecret),
      }
    );
    
    if (response.status !== 200) {
      throw new Error(`Pinata pin failed: ${response.statusText}`);
    }
    
    return true;
  } catch (error) {
    console.error('Error pinning to Pinata:', error);
    throw error;
  }
};

/**
 * Check if a CID is pinned
 * @param {string} cid - Content Identifier to check
 * @param {string} [apiKey] - Pinata API key (optional, will use env var if not provided)
 * @param {string} [apiSecret] - Pinata API secret (optional, will use env var if not provided)
 * @returns {Promise<boolean>} - Whether the CID is pinned
 */
export const isPinnedOnPinata = async (cid, apiKey = DEFAULT_API_KEY, apiSecret = DEFAULT_API_SECRET) => {
  try {
    if (!apiKey || !apiSecret) {
      throw new Error('Pinata API key and secret are required for authentication');
    }

    const response = await axios.get(
      `${PINATA_API_URL}/pinning/pinList?hashContains=${cid}`,
      {
        headers: getAuthHeaders(apiKey, apiSecret),
      }
    );
    
    if (response.status !== 200) {
      throw new Error(`Pinata pin check failed: ${response.statusText}`);
    }
    
    return response.data.count > 0;
  } catch (error) {
    console.error('Error checking pin status on Pinata:', error);
    throw error;
  }
};

/**
 * Check Pinata connection status
 * @param {string} [apiKey] - Pinata API key (optional, will use env var if not provided)
 * @param {string} [apiSecret] - Pinata API secret (optional, will use env var if not provided)
 * @returns {Promise<boolean>} - Whether the connection is successful
 */
export const checkPinataStatus = async (apiKey = DEFAULT_API_KEY, apiSecret = DEFAULT_API_SECRET) => {
  try {
    if (!apiKey || !apiSecret) {
      throw new Error('Pinata API key and secret are required for authentication');
    }

    const response = await axios.get(
      `${PINATA_API_URL}/data/testAuthentication`,
      {
        headers: getAuthHeaders(apiKey, apiSecret),
      }
    );
    
    return response.status === 200;
  } catch (error) {
    console.error('Error checking Pinata status:', error);
    return false;
  }
};

/**
 * List all stored CIDs from localStorage
 * @returns {Array<{cid: string, timestamp: string, name: string, source: string}>} - Array of stored CIDs with metadata
 */
export const listStoredCIDs = () => {
  try {
    const storedCIDs = JSON.parse(localStorage.getItem('ipfsCIDs') || '[]');
    return storedCIDs.map(item => ({
      cid: item.cid,
      timestamp: item.timestamp,
      name: item.name || 'Unknown',
      source: item.source || 'pinata'
    }));
  } catch (error) {
    console.error('Error listing stored CIDs:', error);
    return [];
  }
}; 