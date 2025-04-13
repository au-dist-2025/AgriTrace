// IPFS storage implementation with fallback to local storage
// This implementation uses Storacha.network for IPFS functionality with did:key authentication

import axios from 'axios';

// Storacha.network API configuration
const STORACHA_API_URL = 'https://api.storacha.network';

// Helper function to get authentication headers with did:key
const getAuthHeaders = (didKey) => {
  return {
    'Authorization': `Bearer ${didKey}`,
    'Content-Type': 'application/json',
  };
};

/**
 * Upload data to IPFS via Storacha.network using did:key authentication
 * @param {string|File} data - Text content or File object to upload
 * @param {string} didKey - The did:key for authentication
 * @returns {Promise<string>} - CID of the uploaded content
 */
export const uploadToIPFS = async (data, didKey) => {
  try {
    if (!didKey) {
      throw new Error('did:key is required for authentication');
    }

    let fileData;
    
    if (typeof data === 'string') {
      // If data is a string, create a file with the text content
      const blob = new Blob([data], { type: 'text/plain' });
      fileData = new File([blob], 'content.txt', { type: 'text/plain' });
    } else if (data instanceof File) {
      // If data is a File object, use it directly
      fileData = data;
    } else {
      throw new Error('Invalid data type. Expected string or File.');
    }
    
    // Create form data for the file upload
    const formData = new FormData();
    formData.append('file', fileData);
    
    // Upload to Storacha.network with did:key authentication
    const response = await fetch(`${STORACHA_API_URL}/ipfs/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${didKey}`,
      },
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`IPFS upload failed: ${errorData.message || response.statusText}`);
    }
    
    const result = await response.json();
    const cid = result.cid;
    
    // Store the CID in localStorage for reference
    const storedCIDs = JSON.parse(localStorage.getItem('ipfsCIDs') || '[]');
    storedCIDs.push({
      cid,
      timestamp: new Date().toISOString(),
      name: data instanceof File ? data.name : 'text-content.txt',
      source: 'storacha',
      didKey: didKey.substring(0, 10) + '...' // Store a truncated version for reference
    });
    localStorage.setItem('ipfsCIDs', JSON.stringify(storedCIDs));
    
    return cid;
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    throw error;
  }
};

/**
 * Fetch data from IPFS using a CID and did:key authentication
 * @param {string} cid - Content Identifier
 * @param {string} didKey - The did:key for authentication
 * @returns {Promise<Blob>} - Blob containing the fetched data
 */
export const fetchFromIPFS = async (cid, didKey) => {
  try {
    if (!didKey) {
      throw new Error('did:key is required for authentication');
    }

    // Use Storacha.network gateway to fetch content with did:key authentication
    const response = await fetch(`${STORACHA_API_URL}/ipfs/gateway/${cid}`, {
      method: 'GET',
      headers: getAuthHeaders(didKey),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`IPFS fetch failed: ${errorData.message || response.statusText}`);
    }
    
    return await response.blob();
  } catch (error) {
    console.error('Error fetching from IPFS:', error);
    throw error;
  }
};

/**
 * Pin a CID to ensure it remains available using did:key authentication
 * @param {string} cid - Content Identifier to pin
 * @param {string} didKey - The did:key for authentication
 * @returns {Promise<boolean>} - Success status
 */
export const pinToIPFS = async (cid, didKey) => {
  try {
    if (!didKey) {
      throw new Error('did:key is required for authentication');
    }

    const response = await fetch(`${STORACHA_API_URL}/ipfs/pin`, {
      method: 'POST',
      headers: getAuthHeaders(didKey),
      body: JSON.stringify({ cid }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`IPFS pin failed: ${errorData.message || response.statusText}`);
    }
    
    const result = await response.json();
    return result.success === true;
  } catch (error) {
    console.error('Error pinning to IPFS:', error);
    throw error;
  }
};

/**
 * Check if a CID is pinned using did:key authentication
 * @param {string} cid - Content Identifier to check
 * @param {string} didKey - The did:key for authentication
 * @returns {Promise<boolean>} - Whether the CID is pinned
 */
export const isPinned = async (cid, didKey) => {
  try {
    if (!didKey) {
      throw new Error('did:key is required for authentication');
    }

    const response = await fetch(`${STORACHA_API_URL}/ipfs/pin/status/${cid}`, {
      method: 'GET',
      headers: getAuthHeaders(didKey),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`IPFS pin check failed: ${errorData.message || response.statusText}`);
    }
    
    const result = await response.json();
    return result.pinned === true;
  } catch (error) {
    console.error('Error checking pin status:', error);
    throw error;
  }
};

/**
 * Check IPFS connection status using did:key authentication
 * @param {string} didKey - The did:key for authentication
 * @returns {Promise<boolean>} - Whether the connection is successful
 */
export const checkIPFSStatus = async (didKey) => {
  try {
    if (!didKey) {
      throw new Error('did:key is required for authentication');
    }

    const response = await fetch(`${STORACHA_API_URL}/ipfs/status`, {
      method: 'GET',
      headers: getAuthHeaders(didKey),
    });
    
    if (!response.ok) {
      return false;
    }
    
    const result = await response.json();
    return result.status === 'connected';
  } catch (error) {
    console.error('Error checking IPFS status:', error);
    return false;
  }
};

/**
 * List all stored CIDs from localStorage
 * @returns {Array<{cid: string, timestamp: string, name: string, source: string, didKey: string}>} - Array of stored CIDs with metadata
 */
export const listStoredCIDs = () => {
  try {
    const storedCIDs = JSON.parse(localStorage.getItem('ipfsCIDs') || '[]');
    return storedCIDs.map(item => ({
      cid: item.cid,
      timestamp: item.timestamp,
      name: item.name || 'Unknown',
      source: item.source || 'storacha',
      didKey: item.didKey || 'Unknown'
    }));
  } catch (error) {
    console.error('Error listing stored CIDs:', error);
    return [];
  }
};