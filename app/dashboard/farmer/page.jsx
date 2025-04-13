'use client';

import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { contractADDRESS, contractAbi } from '@/Utils/config';
import { uploadToIPFS, fetchFromIPFS, listStoredCIDs } from '@/Utils/web3storage';

export default function FarmerDashboard() {
  const router = useRouter();
  const [isFarmer, setIsFarmer] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [newMetadata, setNewMetadata] = useState('');
  const [newFarmerDataCID, setNewFarmerDataCID] = useState('');
  const [isMinting, setIsMinting] = useState(false);
  
  // New state for traceability data
  const [traceData, setTraceData] = useState({
    data1: '',
    data2: '',
    data3: ''
  });

  // Existing farmer status check remains unchanged
  useEffect(() => {
    const checkFarmerStatus = async () => {
      try {
        const userAddress = localStorage.getItem('userAddress');
        if (!userAddress) {
          router.push('/');
          return;
        }
  
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(contractADDRESS, contractAbi, provider);
        
        const farmerStatus = await contract.farmers(userAddress);
        setIsFarmer(farmerStatus);
        
        if (!farmerStatus) {
          router.push('/registration');
          return;
        }
  
        // Load products after confirming farmer status
        await loadFarmerProducts(userAddress);
  
      } catch (error) {
        console.error('Error checking farmer status:', error);
        toast.error('Error verifying farmer status');
      } finally {
        setIsLoading(false);
      }
    };
  
    checkFarmerStatus();
  }, [router]);

  // Updated product loading logic
const loadFarmerProducts = async (userAddress) => {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(contractADDRESS, contractAbi, provider);
    
    // Get all Transfer events to find tokens owned by the farmer
    const filter = contract.filters.Transfer(null, userAddress, null);
    const events = await contract.queryFilter(filter);
    
    const farmerProducts = [];

    // Process each transfer event
    for (const event of events) {
      try {
        const tokenId = event.args.tokenId.toString();
        
        // Get product history
        const history = await contract.getProductHistory(tokenId);
        if (history.length === 0) continue;

        // Check if the farmer is the first actor in the history
        const isFarmerProduct = history[0].actor.toLowerCase() === userAddress.toLowerCase();
        if (!isFarmerProduct) continue;

        // Get token URI
        const metadata = await contract.tokenURI(tokenId);

        farmerProducts.push({
          id: tokenId,
          metadata,
          history
        });
      } catch (error) {
        console.error(`Error processing token ${event.args.tokenId}:`, error);
        continue;
      }
    }

    setProducts(farmerProducts);
    
  } catch (error) {
    console.error('Error loading products:', error);
    toast.error('Error loading products');
  }
};

  // New: Mint product functionality with IPFS integration
  // Update the mintProduct function
const mintProduct = async () => {
  // Validate required fields
  if (!traceData.data1 || !traceData.data2 || !traceData.data3) {
    toast.error('Please fill all required fields');
    return;
  }

  try {
    setIsMinting(true);
    
    // Structure metadata properly
    const metadata = {
      name: `Farm Product #${Date.now()}`,
      description: "Agricultural Product NFT",
      attributes: [
        { trait_type: "Crop Type", value: traceData.data1 },
        { trait_type: "Harvest Date", value: traceData.data2 },
        { trait_type: "Location", value: traceData.data3 }
      ]
    };

    // Upload structured metadata
    const metadataCID = await uploadToIPFS(metadata);
    
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractADDRESS, contractAbi, signer);

    const tx = await contract.mintProduct(metadataCID, metadataCID);
    await tx.wait();
    
    toast.success('Product minted successfully!');
    // Reset form
    setTraceData({ data1: '', data2: '', data3: '' });
    router.refresh();

  } catch (error) {
    console.error('Minting failed:', error);
    toast.error(`Minting failed: ${error.reason || error.message}`);
  } finally {
    setIsMinting(false);
  }
};

  // New: Function to fetch and display trace data
  const [traceDataMap, setTraceDataMap] = useState({});
  const [storedCIDs, setStoredCIDs] = useState([]);

  // Load stored CIDs on component mount
  useEffect(() => {
    const cids = listStoredCIDs();
    setStoredCIDs(cids);
  }, []);

  const fetchTraceData = async (cid) => {
    if (traceDataMap[cid]) return traceDataMap[cid];
    
    try {
      const data = await fetchFromIPFS(cid);
      setTraceDataMap(prev => ({ ...prev, [cid]: data }));
      return data;
    } catch (error) {
      console.error('Error fetching trace data:', error);
      return null;
    }
  };

  // Function to view data for a specific CID
  const viewCIDData = async (cid) => {
    try {
      const data = await fetchTraceData(cid);
      if (data) {
        toast.success(`Data loaded for ID: ${cid}`);
        // Display the data in a more user-friendly way
        const dataDisplay = document.createElement('div');
        dataDisplay.innerHTML = `
          <div style="padding: 20px; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h3 style="margin-top: 0; color: #333;">Data for ID: ${cid}</h3>
            <pre style="background: #f5f5f5; padding: 10px; border-radius: 4px; overflow: auto;">
              ${JSON.stringify(data, null, 2)}
            </pre>
            <button onclick="this.parentElement.remove()" style="margin-top: 10px; padding: 5px 10px; background: #e53e3e; color: white; border: none; border-radius: 4px; cursor: pointer;">
              Close
            </button>
          </div>
        `;
        document.body.appendChild(dataDisplay);
      }
    } catch (error) {
      toast.error(`Error loading data for ID: ${cid}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userAddress');
    router.push('/');
    toast.success('Logged out successfully');
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center">
        <div className="text-2xl text-green-800">Loading...</div>
      </div>
    );
  }

  if (!isFarmer) {
    return null;
  }
  
  return (
    <div className="min-h-screen bg-green-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-green-800">Farmer Dashboard</h1>
          <button
            onClick={handleLogout}
            className="text-white bg-red-600 hover:bg-red-500 px-4 py-2 rounded-md transition duration-200"
          >
            Logout
          </button>
        </div>

        {/* Product Minting Section */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Create New Product</h2>
          <div className="grid grid-cols-1 gap-4 mb-4">
            <input
              type="text"
              placeholder="Crop Type (e.g., Organic Wheat)"
              className="p-2 border rounded"
              value={traceData.data1}
              onChange={(e) => setTraceData(p => ({ ...p, data1: e.target.value }))}
            />

            <input
              type="date"
              placeholder="Harvest Date"
              className="p-2 border rounded"
              value={traceData.data2}
              onChange={(e) => setTraceData(p => ({ ...p, data2: e.target.value }))}
            />

            <input
              type="text"
              placeholder="Location (e.g., Punjab, India)"
              className="p-2 border rounded"
              value={traceData.data3}
              onChange={(e) => setTraceData(p => ({ ...p, data3: e.target.value }))}
            />
          </div>
          <button
            onClick={mintProduct}
            disabled={isMinting}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
          >
            {isMinting ? 'Minting...' : 'Mint New Product'}
          </button>
        </div>

        {/* Stored CIDs Section */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Stored Data</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b text-left">ID</th>
                  <th className="py-2 px-4 border-b text-left">Date</th>
                  <th className="py-2 px-4 border-b text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {storedCIDs.length > 0 ? (
                  storedCIDs.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="py-2 px-4 border-b">
                        <span className="text-gray-700">
                          {item.cid.substring(0, 15)}...
                        </span>
                      </td>
                      <td className="py-2 px-4 border-b">{item.date}</td>
                      <td className="py-2 px-4 border-b">
                        <button
                          onClick={() => viewCIDData(item.cid)}
                          className="text-green-600 hover:text-green-800 mr-2"
                        >
                          View Data
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="py-4 px-4 text-center text-gray-500">
                      No data stored yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Product List Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">My Agricultural Products</h2>
          <div className="space-y-4">
            {products.map(product => (
              <div key={product.id} className="border p-4 rounded bg-white">
                <h3 className="font-semibold text-gray-800">Product ID: {product.id}</h3>
                <p className="text-sm text-gray-600">Metadata: {product.metadata}</p>
                <div className="mt-2">
                  <h4 className="font-medium text-gray-700">Trace History:</h4>
                  {product.history.map((record, index) => (
                    <div key={index} className="ml-4 text-sm border-l-2 border-gray-200 pl-4 my-2">
                      <p className="text-gray-700">Stage: {record.stage}</p>
                      <p className="text-gray-600">Timestamp: {new Date(record.timestamp * 1000).toLocaleString()}</p>
                      {record.metadataCID && (
                        <div className="mt-2">
                          <button
                            onClick={async () => {
                              const data = await fetchTraceData(record.metadataCID);
                              if (data) {
                                toast.success('Trace data loaded');
                              }
                            }}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            View Trace Data
                          </button>
                          {traceDataMap[record.metadataCID] && (
                            <div className="mt-2 p-2 bg-gray-50 rounded">
                              <p className="text-gray-700">Data 1: {traceDataMap[record.metadataCID].data1}</p>
                              <p className="text-gray-700">Data 2: {traceDataMap[record.metadataCID].data2}</p>
                              <p className="text-gray-700">Data 3: {traceDataMap[record.metadataCID].data3}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Toaster position="top-center" />
    </div>
  );
}