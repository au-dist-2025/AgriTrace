// Simple IPFS storage implementation using localStorage
// This is a placeholder implementation that doesn't actually store data on IPFS
// In a production environment, you would use a real IPFS service

import axios from 'axios';

// Infura IPFS API configuration
const INFURA_IPFS_API = 'https://ipfs.infura.io:5001/api/v0';
const INFURA_PROJECT_ID = process.env.NEXT_PUBLIC_INFURA_PROJECT_ID;
const INFURA_PROJECT_SECRET = process.env.NEXT_PUBLIC_INFURA_PROJECT_SECRET;

// Function to upload data to IPFS using Infura
export const uploadToIPFS = async (data) => {
  try {
    // Create a file from the data
    const file = new File([JSON.stringify(data)], 'trace-data.json', { type: 'application/json' });
    
    // Create form data
    const formData = new FormData();
    formData.append('file', file);
    
    // Upload to Infura IPFS
    const response = await axios.post(`${INFURA_IPFS_API}/add`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': 'Basic ' + Buffer.from(INFURA_PROJECT_ID + ':' + INFURA_PROJECT_SECRET).toString('base64')
      }
    });
    
    // Get the CID from the response
    const cid = response.data.Hash;
    
    // Store the CID in localStorage for easy reference
    const storedData = {
      cid,
      timestamp: Date.now(),
      data: data
    };
    
    // Get existing stored CIDs or initialize empty array
    const storedCIDs = JSON.parse(localStorage.getItem('ipfs_cids') || '[]');
    storedCIDs.push(storedData);
    localStorage.setItem('ipfs_cids', JSON.stringify(storedCIDs));
    
    console.log(`Data uploaded to IPFS with CID: ${cid}`);
    console.log(`View your data at: https://ipfs.io/ipfs/${cid}`);
    
    // Return the CID
    return cid;
    
  } catch (error) {
    console.error('Upload failed:', error);
    throw new Error('IPFS upload error: ' + (error.response?.data?.Message || error.message));
  }
};

// Function to fetch data from IPFS using Infura
export const fetchFromIPFS = async (cid) => {
  try {
    // First try to get from localStorage for faster access
    const storedCIDs = JSON.parse(localStorage.getItem('ipfs_cids') || '[]');
    const storedData = storedCIDs.find(item => item.cid === cid);
    
    if (storedData) {
      console.log(`Data retrieved from local cache for CID: ${cid}`);
      return storedData.data;
    }
    
    // If not in localStorage, fetch from IPFS
    console.log(`Fetching data from IPFS for CID: ${cid}`);
    
    // Use Infura gateway to fetch the data
    const response = await axios.get(`https://ipfs.infura.io:5001/api/v0/cat?arg=${cid}`, {
      headers: {
        'Authorization': 'Basic ' + Buffer.from(INFURA_PROJECT_ID + ':' + INFURA_PROJECT_SECRET).toString('base64')
      }
    });
    
    const data = JSON.parse(response.data);
    
    // Store in localStorage for future reference
    storedCIDs.push({
      cid,
      timestamp: Date.now(),
      data
    });
    localStorage.setItem('ipfs_cids', JSON.stringify(storedCIDs));
    
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};

// Function to list all stored CIDs
export const listStoredCIDs = () => {
  try {
    const storedCIDs = JSON.parse(localStorage.getItem('ipfs_cids') || '[]');
    return storedCIDs.map(item => ({
      cid: item.cid,
      timestamp: item.timestamp,
      date: new Date(item.timestamp).toLocaleString()
    }));
  } catch (error) {
    console.error('Error listing CIDs:', error);
    return [];
  }
};