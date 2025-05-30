'use client';

import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { contractADDRESS, contractAbi } from '@/Utils/config';
import { uploadToPinata, fetchFromPinata, listStoredCIDs } from '@/Utils/pinata';

export default function WarehouseDashboard() {
  const router = useRouter();
  const [isWarehouse, setIsWarehouse] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [isAddingWarehouseData, setIsAddingWarehouseData] = useState(false);
  
  // State for transfer modal
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferData, setTransferData] = useState({
    tokenId: '',
    toAddress: ''
  });
  const [isTransferring, setIsTransferring] = useState(false);
  
  // State for traceability data
  const [traceData, setTraceData] = useState({
    storageType: '',
    temperature: '',
    humidity: '',
    entryDate: '',
    expectedExitDate: '',
    storageConditions: 'Normal' // Default value
  });

  // State for Pinata API credentials
  const [pinataCredentials, setPinataCredentials] = useState({
    apiKey: process.env.NEXT_PUBLIC_PINATA_API_KEY || '',
    apiSecret: process.env.NEXT_PUBLIC_PINATA_API_SECRET || ''
  });
  const [isPinataValid, setIsPinataValid] = useState(false);

  // State for trace data
  const [traceDataMap, setTraceDataMap] = useState({});
  const [storedCIDs, setStoredCIDs] = useState([]);

  // Check warehouse status
  useEffect(() => {
    const checkWarehouseStatus = async () => {
      try {
        const userAddress = localStorage.getItem('userAddress');
        if (!userAddress) {
          router.push('/');
          return;
        }
  
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(contractADDRESS, contractAbi, provider);
        
        const warehouseStatus = await contract.warehouses(userAddress);
        setIsWarehouse(warehouseStatus);
        
        if (!warehouseStatus) {
          router.push('/registration');
          return;
        }
  
        // Load products after confirming warehouse status
        await loadWarehouseProducts(userAddress);
  
      } catch (error) {
        console.error('Error checking warehouse status:', error);
        toast.error('Error verifying warehouse status');
      } finally {
        setIsLoading(false);
      }
    };
  
    checkWarehouseStatus();
  }, [router]);

  // Validate Pinata credentials
  useEffect(() => {
    // Simple validation for Pinata credentials
    const isValid = pinataCredentials.apiKey.length > 0 && pinataCredentials.apiSecret.length > 0;
    setIsPinataValid(isValid);
  }, [pinataCredentials]);

  // Load stored CIDs on component mount
  useEffect(() => {
    const cids = listStoredCIDs();
    setStoredCIDs(cids);
  }, []);

  // Load warehouse products
  const loadWarehouseProducts = async (userAddress) => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(contractADDRESS, contractAbi, provider);
      
      // Get all Transfer events to find tokens owned by the warehouse
      const filter = contract.filters.Transfer(null, userAddress, null);
      const events = await contract.queryFilter(filter);
      
      const warehouseProducts = [];

      // Process each transfer event
      for (const event of events) {
        try {
          const tokenId = event.args.tokenId.toString();
          
          // Get product history
          const history = await contract.getProductHistory(tokenId);
          if (history.length === 0) continue;

          // Get token URI
          const metadata = await contract.tokenURI(tokenId);
          
          // Check if the product is in the WAREHOUSE stage
          const currentStage = await contract.currentStage(tokenId);
          
          // Check if the product was transferred from a transporter
          const isFromTransporter = history.length > 0 && 
                              history[0].actor.toLowerCase() !== userAddress.toLowerCase() && 
                              history[0].stage === 1; // 1 is TRANSPORTER stage
          
          // If the product is owned by the warehouse but not in WAREHOUSE stage,
          // it means it was transferred to the warehouse but the stage hasn't been updated
          // We'll still include it in the list but mark it as needing stage update
          const needsStageUpdate = currentStage !== 2 && isFromTransporter;
          
          // Check if warehouse data has already been added
          const hasWarehouseData = history.some(record => 
            record.actor.toLowerCase() === userAddress.toLowerCase() && 
            record.stage === 2 // 2 is WAREHOUSE stage
          );
          
          const productData = {
            id: tokenId,
            metadata,
            history,
            isFromTransporter,
            currentStage,
            needsStageUpdate,
            hasWarehouseData
          };
          
          // Add all products owned by the warehouse
          warehouseProducts.push(productData);
          
        } catch (error) {
          console.error(`Error processing token ${event.args.tokenId}:`, error);
          continue;
        }
      }

      setProducts(warehouseProducts);
      
    } catch (error) {
      console.error('Error loading products:', error);
      toast.error('Error loading products');
    }
  };

  // Function to fetch and display trace data
  const fetchTraceData = async (cid) => {
    if (traceDataMap[cid]) return traceDataMap[cid];
    
    try {
      // Use Pinata to fetch data
      const data = await fetchFromPinata(cid);
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
            <h3 style="margin-top: 0; color: #000000;">Data for ID: ${cid}</h3>
            <pre style="background: text rgb(0, 0, 0); padding: 10px; border-radius: 4px; overflow: auto; color: #000000;">
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

  // Function to add warehouse data
  const addWarehouseData = async (tokenId) => {
    // Validate required fields
    if (!traceData.storageType || !traceData.temperature || !traceData.humidity || !traceData.entryDate || !traceData.expectedExitDate) {
      toast.error('Please fill all required fields');
      return;
    }

    // Validate Pinata credentials
    if (!isPinataValid) {
      toast.error('Pinata API credentials are not configured properly. Please check your .env.local file.');
      return;
    }

    try {
      setIsAddingWarehouseData(true);
      
      // Structure metadata properly
      const metadata = {
        name: `Warehouse Data #${Date.now()}`,
        description: "Warehouse Storage Data for Agricultural Product",
        attributes: [
          { trait_type: "Storage Type", value: traceData.storageType },
          { trait_type: "Temperature", value: traceData.temperature },
          { trait_type: "Humidity", value: traceData.humidity },
          { trait_type: "Entry Date", value: traceData.entryDate },
          { trait_type: "Expected Exit Date", value: traceData.expectedExitDate },
          { trait_type: "Storage Conditions", value: traceData.storageConditions }
        ]
      };

      // Upload structured metadata with Pinata
      const metadataCID = await uploadToPinata(metadata);
      
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractADDRESS, contractAbi, signer);

      const tx = await contract.addWarehouseData(tokenId, metadataCID);
      await tx.wait();
      
      toast.success('Warehouse data added successfully!');
      // Reset form
      setTraceData({ 
        storageType: '', 
        temperature: '', 
        humidity: '', 
        entryDate: '', 
        expectedExitDate: '', 
        storageConditions: 'Normal' 
      });
      router.refresh();

    } catch (error) {
      console.error('Adding warehouse data failed:', error);
      toast.error(`Adding warehouse data failed: ${error.reason || error.message}`);
    } finally {
      setIsAddingWarehouseData(false);
    }
  };

  // Function to handle NFT transfer
  const handleTransfer = async () => {
    // Validate inputs
    if (!transferData.tokenId || !transferData.toAddress) {
      toast.error('Please provide both token ID and recipient address');
      return;
    }

    // Validate address format
    if (!ethers.utils.isAddress(transferData.toAddress)) {
      toast.error('Invalid recipient address format');
      return;
    }

    try {
      setIsTransferring(true);
      
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractADDRESS, contractAbi, signer);
      
      // Get the current user's address
      const fromAddress = await signer.getAddress();
      
      // Call transferFrom function
      const tx = await contract.transferFrom(
        fromAddress,
        transferData.toAddress,
        transferData.tokenId
      );
      
      await tx.wait();
      
      toast.success('NFT transferred successfully!');
      setShowTransferModal(false);
      setTransferData({ tokenId: '', toAddress: '' });
      
      // Refresh the page to update the product list
      router.refresh();
      
    } catch (error) {
      console.error('Transfer failed:', error);
      toast.error(`Transfer failed: ${error.reason || error.message}`);
    } finally {
      setIsTransferring(false);
    }
  };

  // Function to update product stage to WAREHOUSE
  const updateProductStage = async (tokenId) => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractADDRESS, contractAbi, signer);
      
      // Create a minimal metadata object for the stage update
      const metadata = {
        name: `Warehouse Stage Update #${Date.now()}`,
        description: "Stage Update to WAREHOUSE",
        attributes: [
          { trait_type: "Stage Update", value: "TRANSPORTER to WAREHOUSE" },
          { trait_type: "Timestamp", value: new Date().toISOString() }
        ]
      };

      // Upload metadata to Pinata
      const metadataCID = await uploadToPinata(metadata);
      
      // Call addWarehouseData to update the stage
      const tx = await contract.addWarehouseData(tokenId, metadataCID);
      await tx.wait();
      
      toast.success('Product stage updated to WAREHOUSE');
      router.refresh();
      
    } catch (error) {
      console.error('Error updating product stage:', error);
      toast.error(`Error updating stage: ${error.reason || error.message}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userAddress');
    router.push('/');
    toast.success('Logged out successfully');
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-orange-50 flex items-center justify-center">
        <div className="text-2xl text-orange-800">Loading...</div>
      </div>
    );
  }

  if (!isWarehouse) {
    return null;
  }
  
  return (
    <div className="min-h-screen bg-orange-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-orange-800">Warehouse Dashboard</h1>
          <div className="flex space-x-4">
            <button
              onClick={() => setShowTransferModal(true)}
              className="text-white bg-orange-600 hover:bg-orange-500 px-4 py-2 rounded-md transition duration-200"
            >
              Transfer NFT
            </button>
            <button
              onClick={handleLogout}
              className="text-white bg-red-600 hover:bg-red-500 px-4 py-2 rounded-md transition duration-200"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Transfer Modal */}
        {showTransferModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-xl font-semibold text-black mb-4">Transfer NFT</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Token ID</label>
                  <input
                    type="text"
                    placeholder="Enter token ID"
                    className="w-full p-2 border rounded text-black"
                    value={transferData.tokenId}
                    onChange={(e) => setTransferData({...transferData, tokenId: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Recipient Address</label>
                  <input
                    type="text"
                    placeholder="Enter recipient address"
                    className="w-full p-2 border rounded text-black"
                    value={transferData.toAddress}
                    onChange={(e) => setTransferData({...transferData, toAddress: e.target.value})}
                  />
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setShowTransferModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleTransfer}
                    disabled={isTransferring}
                    className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:bg-orange-300"
                  >
                    {isTransferring ? 'Transferring...' : 'Transfer'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stored CIDs Section */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-semibold text-black mb-4">Stored Data</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b text-left text-black">ID</th>
                  <th className="py-2 px-4 border-b text-left text-black">Date</th>
                  <th className="py-2 px-4 border-b text-left text-black">Source</th>
                  <th className="py-2 px-4 border-b text-left text-black">Actions</th>
                </tr>
              </thead>
              <tbody>
                {storedCIDs.length > 0 ? (
                  storedCIDs.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="py-2 px-4 border-b">
                        <span className="text-black">
                          {item.cid.substring(0, 15)}...
                        </span>
                      </td>
                      <td className="py-2 px-4 border-b text-black">{item.timestamp}</td>
                      <td className="py-2 px-4 border-b">
                        <span className={`px-2 py-1 rounded text-xs ${
                          item.source === 'pinata' ? 'bg-blue-100 text-black' : 
                          item.source === 'local' ? 'bg-green-100 text-black' : 
                          'bg-gray-100 text-black'
                        }`}>
                          {item.source || 'unknown'}
                        </span>
                      </td>
                      <td className="py-2 px-4 border-b">
                        <button
                          onClick={() => viewCIDData(item.cid)}
                          className="text-blue-600 hover:text-blue-800 mr-2"
                        >
                          View Data
                        </button>
                        {item.source === 'pinata' && (
                          <a 
                            href={`https://gateway.pinata.cloud/ipfs/${item.cid}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800"
                          >
                            View on IPFS
                          </a>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="py-4 px-4 text-center text-black">
                      No data stored yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Product List Section */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-semibold text-black mb-4">My Warehouse Products</h2>
          <div className="space-y-4">
            {products.length > 0 ? (
              products.map(product => (
                <div key={product.id} className="border p-4 rounded bg-white">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-black">Product ID: {product.id}</h3>
                    <div className="flex space-x-2">
                      {product.isFromTransporter && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          From Transporter
                        </span>
                      )}
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        product.currentStage === 2 
                          ? 'bg-orange-100 text-orange-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        Stage: {product.currentStage === 2 ? 'WAREHOUSE' : 'TRANSPORTER'}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-black">Metadata: {product.metadata}</p>
                  <div className="mt-2">
                    <h4 className="font-medium text-black">Trace History:</h4>
                    {product.history.map((record, index) => (
                      <div key={index} className="ml-4 text-sm border-l-2 border-gray-200 pl-4 my-2">
                        <p className="text-black">Stage: {record.stage}</p>
                        <p className="text-black">Actor: {record.actor.substring(0, 6)}...{record.actor.substring(record.actor.length - 4)}</p>
                        <p className="text-black">Timestamp: {new Date(record.timestamp * 1000).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                  
                  {/* Update Stage Button - Only show for products that need stage update */}
                  {product.needsStageUpdate && (
                    <div className="mt-4 p-4 border-t border-gray-200">
                      <p className="text-yellow-600 mb-2">
                        This product was transferred to you but is still in TRANSPORTER stage.
                        Please update the stage to WAREHOUSE to proceed.
                      </p>
                      <button
                        onClick={() => updateProductStage(product.id)}
                        className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                      >
                        Update to WAREHOUSE Stage
                      </button>
                    </div>
                  )}
                                    
                  {/* Add Traceability Data Button - Show for all products regardless of stage */}
                  {!product.needsStageUpdate && (
                    <div className="mt-4 p-4 border-t border-gray-200">
                      <h4 className="font-medium text-black mb-2">Add Traceability Data</h4>
                      {product.hasWarehouseData ? (
                        <div className="bg-green-50 p-4 rounded-md">
                          <p className="text-green-700 font-medium">Traceability data has already been added for this product.</p>
                        </div>
                      ) : (
                        <>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <input
                              type="text"
                              placeholder="Storage Type"
                              className="p-2 border rounded text-black"
                              value={traceData.storageType}
                              onChange={(e) => setTraceData(p => ({ ...p, storageType: e.target.value }))}
                            />
                            <input
                              type="text"
                              placeholder="Temperature"
                              className="p-2 border rounded text-black"
                              value={traceData.temperature}
                              onChange={(e) => setTraceData(p => ({ ...p, temperature: e.target.value }))}
                            />
                            <input
                              type="text"
                              placeholder="Humidity"
                              className="p-2 border rounded text-black"
                              value={traceData.humidity}
                              onChange={(e) => setTraceData(p => ({ ...p, humidity: e.target.value }))}
                            />
                            <input
                              type="datetime-local"
                              placeholder="Entry Date"
                              className="p-2 border rounded text-black"
                              value={traceData.entryDate}
                              onChange={(e) => setTraceData(p => ({ ...p, entryDate: e.target.value }))}
                            />
                            <input
                              type="datetime-local"
                              placeholder="Expected Exit Date"
                              className="p-2 border rounded text-black"
                              value={traceData.expectedExitDate}
                              onChange={(e) => setTraceData(p => ({ ...p, expectedExitDate: e.target.value }))}
                            />
                            <select
                              className="p-2 border rounded text-black"
                              value={traceData.storageConditions}
                              onChange={(e) => setTraceData(p => ({ ...p, storageConditions: e.target.value }))}
                            >
                              <option value="Normal">Normal</option>
                              <option value="Refrigerated">Refrigerated</option>
                              <option value="Controlled">Controlled</option>
                            </select>
                          </div>
                          <button
                            onClick={() => addWarehouseData(product.id)}
                            disabled={isAddingWarehouseData || !isPinataValid}
                            className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 disabled:bg-gray-400"
                          >
                            {isAddingWarehouseData ? 'Adding Data...' : 'Add Traceability Data'}
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No products available.</p>
            )}
          </div>
        </div>
      </div>
      <Toaster position="top-center" />
    </div>
  );
}