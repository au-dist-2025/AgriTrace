'use client';

import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { contractADDRESS, contractAbi } from '@/Utils/config';
import { uploadToPinata, fetchFromPinata, listStoredCIDs } from '@/Utils/pinata';

export default function TransporterDashboard() {
  const router = useRouter();
  const [isTransporter, setIsTransporter] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [isAddingTransportData, setIsAddingTransportData] = useState(false);
  
  // State for transfer modal
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferData, setTransferData] = useState({
    tokenId: '',
    toAddress: ''
  });
  const [isTransferring, setIsTransferring] = useState(false);
  
  // State for traceability data
  const [traceData, setTraceData] = useState({
    licensePlate: '',
    type: 'Normal', // Default value
    capacity: '',
    startTime: '',
    endTime: '',
    customsClearance: 'Clear' // Default value
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

  // State for NFTs received from farmers
  const [receivedFromFarmer, setReceivedFromFarmer] = useState([]);

  // Check transporter status
  useEffect(() => {
    const checkTransporterStatus = async () => {
      try {
        const userAddress = localStorage.getItem('userAddress');
        if (!userAddress) {
          router.push('/');
          return;
        }
  
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(contractADDRESS, contractAbi, provider);
        
        const transporterStatus = await contract.transporters(userAddress);
        setIsTransporter(transporterStatus);
        
        if (!transporterStatus) {
          router.push('/registration');
          return;
        }
  
        // Load products after confirming transporter status
        await loadTransporterProducts(userAddress);
  
      } catch (error) {
        console.error('Error checking transporter status:', error);
        toast.error('Error verifying transporter status');
      } finally {
        setIsLoading(false);
      }
    };
  
    checkTransporterStatus();
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

  // Load transporter products
  const loadTransporterProducts = async (userAddress) => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(contractADDRESS, contractAbi, provider);
      
      // Get all Transfer events to find tokens owned by the transporter
      const filter = contract.filters.Transfer(null, userAddress, null);
      const events = await contract.queryFilter(filter);
      
      const transporterProducts = [];

      // Process each transfer event
      for (const event of events) {
        try {
          const tokenId = event.args.tokenId.toString();
          
          // Get product history
          const history = await contract.getProductHistory(tokenId);
          if (history.length === 0) continue;

          // Get token URI
          const metadata = await contract.tokenURI(tokenId);
          
          // Check if the product was transferred from a farmer
          const isFromFarmer = history.length > 0 && 
                              history[0].actor.toLowerCase() !== userAddress.toLowerCase() && 
                              history[0].stage === 0; // 0 is FARMER stage
          
          // Only include products from farmers
          if (isFromFarmer) {
            // Check if transport data has already been added
            const hasTransportData = history.some(record => 
              record.actor.toLowerCase() === userAddress.toLowerCase() && 
              record.stage === 1 // 1 is TRANSPORTER stage
            );
            
            const productData = {
              id: tokenId,
              metadata,
              history,
              isFromFarmer,
              hasTransportData
            };
            
            transporterProducts.push(productData);
          }
          
        } catch (error) {
          console.error(`Error processing token ${event.args.tokenId}:`, error);
          continue;
        }
      }

      setProducts(transporterProducts);
      
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

  // Function to add transport data
  const addTransportData = async (tokenId) => {
    // Validate required fields
    if (!traceData.licensePlate || !traceData.capacity || !traceData.startTime || !traceData.endTime) {
      toast.error('Please fill all required fields');
      return;
    }

    // Validate Pinata credentials
    if (!isPinataValid) {
      toast.error('Pinata API credentials are not configured properly. Please check your .env.local file.');
      return;
    }

    try {
      setIsAddingTransportData(true);
      
      // Structure metadata properly
      const metadata = {
        name: `Transport Data #${Date.now()}`,
        description: "Transportation Data for Agricultural Product",
        attributes: [
          { trait_type: "License Plate", value: traceData.licensePlate },
          { trait_type: "Vehicle Type", value: traceData.type },
          { trait_type: "Capacity", value: traceData.capacity },
          { trait_type: "Start Time", value: traceData.startTime },
          { trait_type: "End Time", value: traceData.endTime },
          { trait_type: "Customs Clearance", value: traceData.customsClearance }
        ]
      };

      // Upload structured metadata with Pinata
      const metadataCID = await uploadToPinata(metadata);
      
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractADDRESS, contractAbi, signer);

      const tx = await contract.addTransportData(tokenId, metadataCID);
      await tx.wait();
      
      toast.success('Transport data added successfully!');
      // Reset form
      setTraceData({ 
        licensePlate: '', 
        type: 'Normal', 
        capacity: '', 
        startTime: '', 
        endTime: '', 
        customsClearance: 'Clear' 
      });
      router.refresh();

    } catch (error) {
      console.error('Adding transport data failed:', error);
      toast.error(`Adding transport data failed: ${error.reason || error.message}`);
    } finally {
      setIsAddingTransportData(false);
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

  const handleLogout = () => {
    localStorage.removeItem('userAddress');
    router.push('/');
    toast.success('Logged out successfully');
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="text-2xl text-blue-800">Loading...</div>
      </div>
    );
  }

  if (!isTransporter) {
    return null;
  }
  
  return (
    <div className="min-h-screen bg-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-800">Transporter Dashboard</h1>
          <div className="flex space-x-4">
            <button
              onClick={() => setShowTransferModal(true)}
              className="text-white bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-md transition duration-200"
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
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
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
          <h2 className="text-xl font-semibold text-black mb-4">My Transport Products</h2>
          <div className="space-y-4">
            {products.length > 0 ? (
              products.map(product => (
                <div key={product.id} className="border p-4 rounded bg-white">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-black">Product ID: {product.id}</h3>
                    <div className="flex space-x-2">
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        From Farmer
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
                  
                  {/* Add Transport Data Section */}
                  <div className="mt-4 p-4 border-t border-gray-200">
                    <h4 className="font-medium text-black mb-2">Add Transport Data</h4>
                    {product.hasTransportData ? (
                      <div className="bg-green-50 p-4 rounded-md">
                        <p className="text-green-700 font-medium">Transport data has already been added for this product.</p>
                      </div>
                    ) : (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <input
                            type="text"
                            placeholder="License Plate"
                            className="p-2 border rounded text-black"
                            value={traceData.licensePlate}
                            onChange={(e) => setTraceData(p => ({ ...p, licensePlate: e.target.value }))}
                          />
                          <select
                            className="p-2 border rounded text-black"
                            value={traceData.type}
                            onChange={(e) => setTraceData(p => ({ ...p, type: e.target.value }))}
                          >
                            <option value="Normal">Normal</option>
                            <option value="Refrigerated">Refrigerated</option>
                          </select>
                          <input
                            type="text"
                            placeholder="Capacity (e.g., 10 tons)"
                            className="p-2 border rounded text-black"
                            value={traceData.capacity}
                            onChange={(e) => setTraceData(p => ({ ...p, capacity: e.target.value }))}
                          />
                          <input
                            type="datetime-local"
                            placeholder="Start Time"
                            className="p-2 border rounded text-black"
                            value={traceData.startTime}
                            onChange={(e) => setTraceData(p => ({ ...p, startTime: e.target.value }))}
                          />
                          <input
                            type="datetime-local"
                            placeholder="End Time"
                            className="p-2 border rounded text-black"
                            value={traceData.endTime}
                            onChange={(e) => setTraceData(p => ({ ...p, endTime: e.target.value }))}
                          />
                          <select
                            className="p-2 border rounded text-black"
                            value={traceData.customsClearance}
                            onChange={(e) => setTraceData(p => ({ ...p, customsClearance: e.target.value }))}
                          >
                            <option value="Clear">Clear</option>
                            <option value="Issues">Issues</option>
                          </select>
                        </div>
                        <button
                          onClick={() => addTransportData(product.id)}
                          disabled={isAddingTransportData || !isPinataValid}
                          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
                        >
                          {isAddingTransportData ? 'Adding Data...' : 'Add Transport Data'}
                        </button>
                      </>
                    )}
                  </div>
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