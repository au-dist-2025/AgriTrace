'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ethers } from 'ethers';
import { toast, Toaster } from 'react-hot-toast';
import { carbonCreditContractAddress, carbonCreditContractAbi, carbonCreditPurchaseContractAddress, carbonCreditPurchaseContractAbi } from '@/Utils/carbonCreditConfig';
import { uploadToPinata, fetchFromPinata } from '@/Utils/pinata';

const CarbonCreditMarketplace = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [availableCredits, setAvailableCredits] = useState([]);
  const [selectedCredit, setSelectedCredit] = useState(null);
  const [purchaseAmount, setPurchaseAmount] = useState('');
  const [buyerAddress, setBuyerAddress] = useState('');
  const [purchaseRequests, setPurchaseRequests] = useState([]);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [showDataModal, setShowDataModal] = useState(false);
  const [ipfsData, setIpfsData] = useState(null);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Connect wallet function
  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        toast.error('Please install MetaMask to purchase carbon credits');
        return;
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      setBuyerAddress(address);
      toast.success('Wallet connected successfully!');
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast.error('Failed to connect wallet');
    }
  };

  // Fetch all available credits from all farmers
  const fetchAvailableCredits = async () => {
    try {
      setLoading(true);
      if (!window.ethereum) {
        toast.error('Please install MetaMask to view carbon credits');
        return;
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        carbonCreditContractAddress,
        carbonCreditContractAbi,
        provider
      );

      // Get all registered farmers
      const filter = contract.filters.FarmerRegistered();
      const events = await contract.queryFilter(filter);
      const farmerAddresses = events.map(event => event.args[0]);

      console.log('Found farmers:', farmerAddresses);
      const credits = [];
      
      // Get all minted credits from each farmer
      for (const farmerAddress of farmerAddresses) {
        try {
          // Get farmer details first
          const farmer = await contract.farmers(farmerAddress);
          if (!farmer.isRegistered) continue;

          console.log('Processing farmer:', farmerAddress, farmer.name);
          
          // Get all carbon requests for this farmer
          let requestIndex = 0;
          while (true) {
            try {
              const request = await contract.carbonRequests(farmerAddress, requestIndex);
              console.log('Found request:', requestIndex, request);
              
              // Check if the request is verified
              if (request.isVerified && request.isMinted) {
                try {
                  // Get the token ID from the request
                  const tokenId = request.tokenId;
                  console.log('Token ID for request:', requestIndex, tokenId.toString());

                  // Get credit details
                  const creditDetails = await contract.getCarbonCredit(tokenId);
                  
                  // Check the balance
                  const balance = await contract.balanceOf(farmerAddress, tokenId);
                  console.log('Token balance:', tokenId.toString(), balance.toString());
                  
                  if (balance.gt(0)) {
                    // Get metadata if available
                    let metadata = null;
                    try {
                      const tokenURI = await contract.uri(tokenId);
                      const ipfsHash = tokenURI.replace('ipfs://', '');
                      metadata = await fetchFromPinata(ipfsHash);
                    } catch (err) {
                      console.error('Error fetching metadata:', err);
                    }
                    
                    credits.push({
                      tokenId: tokenId.toString(),
                      farmer: {
                        address: farmerAddress,
                        name: farmer.name,
                        location: farmer.location,
                        farmerId: farmer.farmerId
                      },
                      amount: creditDetails.amount.toString(),
                      availableBalance: balance.toString(),
                      ipfsHash: creditDetails.ipfsHash,
                      metadata: metadata,
                      isActive: creditDetails.isActive
                    });

                    console.log('Added credit:', {
                      tokenId: tokenId.toString(),
                      farmer: farmer.name,
                      amount: creditDetails.amount.toString(),
                      balance: balance.toString()
                    });
                  }
                } catch (error) {
                  console.error('Error processing token:', error);
                }
              }
              requestIndex++;
            } catch (error) {
              // Break when no more requests found
              if (error.message.includes("invalid request index") || 
                  error.message.includes("out of bounds") ||
                  error.message.includes("reverted")) {
                break;
              }
              console.error(`Error processing request ${requestIndex}:`, error);
              break;
            }
          }
        } catch (error) {
          console.error(`Error processing farmer ${farmerAddress}:`, error);
          continue;
        }
      }
      
      console.log('Total credits found:', credits.length, credits);
      setAvailableCredits(credits);
    } catch (error) {
      console.error('Error fetching credits:', error);
      toast.error('Failed to fetch available credits');
    } finally {
      setLoading(false);
    }
  };

  // Fetch purchase requests for the buyer
  const fetchPurchaseRequests = async () => {
    try {
      if (!window.ethereum || !buyerAddress) {
        console.log('No wallet connected or no buyer address');
        return;
      }

      console.log('Fetching purchase requests for buyer:', buyerAddress);

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const purchaseContract = new ethers.Contract(
        carbonCreditPurchaseContractAddress,
        carbonCreditPurchaseContractAbi,
        provider
      );

      const carbonContract = new ethers.Contract(
        carbonCreditContractAddress,
        carbonCreditContractAbi,
        provider
      );

      // Get all purchase requests for this buyer
      const requests = [];
      const nextIndex = await purchaseContract.nextRequestIndex(buyerAddress);
      
      for (let i = 0; i < nextIndex.toNumber(); i++) {
        try {
          const request = await purchaseContract.purchaseRequests(buyerAddress, i);
          
          if (request.farmer !== ethers.constants.AddressZero) {
            // Get credit details for the token
            let creditDetails = null;
            let ipfsHash = null;
            
            try {
              creditDetails = await carbonContract.getCarbonCredit(request.tokenId);
              ipfsHash = creditDetails.ipfsHash;
              
              // If the ipfsHash starts with 'ipfs://', remove it
              if (ipfsHash && ipfsHash.startsWith('ipfs://')) {
                ipfsHash = ipfsHash.substring(7);
              }
              
              console.log('Credit details for token', request.tokenId.toString(), ':', {
                ipfsHash,
                creditDetails
              });
            } catch (error) {
              console.error('Error fetching credit details:', error);
            }

            requests.push({
              index: i.toString(),
              farmer: request.farmer,
              tokenId: request.tokenId.toString(),
              amount: request.amount.toString(),
              status: request.status.toNumber(),
              timestamp: request.timestamp.toString(),
              ipfsHash: ipfsHash
            });
          }
        } catch (error) {
          console.error('Error fetching request at index', i, error);
          continue;
        }
      }

      console.log('Fetched purchase requests with details:', requests);
      setPurchaseRequests(requests);

    } catch (error) {
      console.error('Error fetching purchase requests:', error);
      toast.error('Failed to fetch purchase requests');
    }
  };

  // Cleanup function for event listeners
  useEffect(() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(
      carbonCreditPurchaseContractAddress,
      carbonCreditPurchaseContractAbi,
      provider
    );

    return () => {
      if (contract) {
        contract.removeAllListeners("PurchaseRequestHandled");
      }
    };
  }, []);

  // Request purchase of carbon credits
  const handleRequestPurchase = async () => {
    if (!selectedCredit || !purchaseAmount || !buyerAddress) {
      toast.error('Please select a credit, enter amount, and connect wallet');
      return;
    }

    const amount = parseInt(purchaseAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (amount > parseInt(selectedCredit.availableBalance)) {
      toast.error('Purchase amount exceeds available balance');
      return;
    }

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        carbonCreditPurchaseContractAddress,
        carbonCreditPurchaseContractAbi,
        signer
      );

      console.log('Creating purchase request:', {
        farmer: selectedCredit.farmer.address,
        tokenId: selectedCredit.tokenId,
        amount: amount,
        buyer: buyerAddress
      });

      // Create purchase request
      const tx = await contract.createPurchaseRequest(
        selectedCredit.farmer.address,
        selectedCredit.tokenId,
        amount,
        { gasLimit: 500000 } // Add explicit gas limit
      );

      // Show loading toast
      toast.loading('Creating purchase request...', { id: 'purchaseRequest' });

      // Wait for transaction confirmation
      const receipt = await tx.wait();
      console.log('Transaction confirmed:', receipt);

      // Verify the request was created and has pending status
      const nextIndex = await contract.nextRequestIndex(buyerAddress);
      const requestIndex = nextIndex.sub(1);
      const request = await contract.purchaseRequests(buyerAddress, requestIndex);
      
      console.log('Created request details:', {
        index: requestIndex.toString(),
        status: request.status.toString(),
        farmer: request.farmer,
        tokenId: request.tokenId.toString(),
        amount: request.amount.toString()
      });

      // Ensure the request has pending status
      if (request.status.toNumber() !== 0) {
        console.error('Request created with incorrect status:', request.status.toString());
        toast.error('Error: Request status is not pending');
        return;
      }

      // Update toast to success
      toast.success('Purchase request created successfully!', { id: 'purchaseRequest' });

      // Reset form
      setPurchaseAmount('');
      setSelectedCredit(null);
      setShowRequestForm(false);

      // Refresh the purchase requests list to get the latest status from the contract
      await fetchPurchaseRequests();
      await fetchAvailableCredits();

    } catch (error) {
      console.error('Request error:', error);
      toast.error('Failed to create purchase request: ' + (error.reason || error.message), { id: 'purchaseRequest' });
    }
  };

  const handleViewData = async (ipfsHash) => {
    try {
      setIsLoadingData(true);
      const data = await fetchFromPinata(ipfsHash);
      setIpfsData(data);
      setShowDataModal(true);
    } catch (error) {
      console.error('Error fetching IPFS data:', error);
      toast.error('Failed to fetch data from IPFS');
    } finally {
      setIsLoadingData(false);
    }
  };

  // Add DataModal component
  const DataModal = () => {
    if (!showDataModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-black">Carbon Credit Data</h2>
            <button
              onClick={() => {
                setShowDataModal(false);
                setIpfsData(null);
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {isLoadingData ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
          ) : ipfsData ? (
            <div className="space-y-4">
              {Object.entries(ipfsData).map(([key, value]) => (
                <div key={key} className="border-b pb-2">
                  <h3 className="text-lg font-medium text-black capitalize">{key.replace(/_/g, ' ')}</h3>
                  {typeof value === 'object' ? (
                    <pre className="mt-2 p-4 bg-gray-50 rounded-lg overflow-x-auto text-black">
                      {JSON.stringify(value, null, 2)}
                    </pre>
                  ) : (
                    <p className="mt-2 text-black">{value}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-black">No data available</p>
          )}
        </div>
      </div>
    );
  };

  // Initial load and periodic refresh
  useEffect(() => {
    const init = async () => {
      await fetchAvailableCredits();
      if (buyerAddress) {
        await fetchPurchaseRequests();
      }
    };

    init();

    // Set up interval for periodic updates
    const interval = setInterval(async () => {
      await fetchAvailableCredits();
      if (buyerAddress) {
        await fetchPurchaseRequests();
      }
    }, 15000); // Reduced to 15 seconds for more frequent updates

    return () => clearInterval(interval);
  }, [buyerAddress]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 shadow-sm"
          >
            Back to Home
          </button>
          {!buyerAddress ? (
            <button
              onClick={connectWallet}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm"
            >
              Connect Wallet
            </button>
          ) : (
            <div className="text-sm text-gray-600">
              Connected: {buyerAddress.substring(0, 6)}...{buyerAddress.substring(38)}
            </div>
          )}
        </div>

        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Carbon Credit Marketplace
          </h1>
          <p className="text-xl text-gray-600">
            Purchase verified carbon credits directly from farmers
          </p>
        </div>

        {/* Available Credits */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Available Carbon Credits
          </h2>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
          ) : availableCredits.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableCredits.map((credit) => (
                <div
                  key={`${credit.farmer.address}-${credit.tokenId}`}
                  className={`bg-gray-50 rounded-xl p-6 border-2 transition-colors ${
                    selectedCredit?.tokenId === credit.tokenId &&
                    selectedCredit?.farmer.address === credit.farmer.address
                      ? 'border-green-500'
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Carbon Credit #{credit.tokenId}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Farmer: {credit.farmer.name}
                      </p>
                    </div>
                    <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                      Verified
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-gray-600">
                      Location: {credit.farmer.location}
                    </p>
                    <p className="text-sm text-gray-600">
                      Farmer ID: {credit.farmer.farmerId}
                    </p>
                    <p className="text-sm text-gray-600">
                      Total Amount: {credit.amount} tons
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      Available: {credit.availableBalance} credits
                    </p>
                  </div>

                  <button
                    onClick={() => setSelectedCredit(credit)}
                    className={`w-full py-2 px-4 rounded-lg transition-colors duration-200 ${
                      selectedCredit?.tokenId === credit.tokenId &&
                      selectedCredit?.farmer.address === credit.farmer.address
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {selectedCredit?.tokenId === credit.tokenId &&
                    selectedCredit?.farmer.address === credit.farmer.address
                      ? 'Selected'
                      : 'Select to Purchase'}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">No carbon credits available</p>
              <p className="text-sm text-gray-500 mt-2">
                Check back later for new verified credits
              </p>
            </div>
          )}
        </div>

        {/* Purchase Request Form */}
        {selectedCredit && (
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Request Carbon Credits
            </h2>
            <div className="max-w-md mx-auto">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Selected Credit
                </label>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-sm text-gray-600">
                    Token ID: #{selectedCredit.tokenId}
                  </p>
                  <p className="text-sm text-gray-600">
                    Farmer: {selectedCredit.farmer.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    Available: {selectedCredit.availableBalance} credits
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <label
                  htmlFor="amount"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Request Amount
                </label>
                <input
                  type="number"
                  id="amount"
                  value={purchaseAmount}
                  onChange={(e) => setPurchaseAmount(e.target.value)}
                  min="1"
                  max={selectedCredit.availableBalance}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                  placeholder="Enter amount to request"
                />
              </div>

              <button
                onClick={handleRequestPurchase}
                disabled={!buyerAddress}
                className="w-full py-3 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 shadow-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {!buyerAddress
                  ? 'Connect Wallet to Request'
                  : 'Request Credits'}
              </button>
            </div>
          </div>
        )}

        {/* Purchase Requests */}
        {buyerAddress && (
          <div className="bg-white rounded-xl shadow-sm p-6 mt-8 border border-gray-100">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Your Purchase Requests
            </h2>
            {purchaseRequests.length > 0 ? (
              <div className="space-y-4">
                {purchaseRequests.map((request) => (
                  <div
                    key={request.index}
                    className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-sm text-gray-600">Token ID: #{request.tokenId}</p>
                        <p className="text-sm text-gray-600">Amount: {request.amount} credits</p>
                        {request.ipfsHash && (
                          <p className="text-xs text-gray-500 font-mono mt-1">
                            IPFS: {request.ipfsHash.substring(0, 15)}...
                          </p>
                        )}
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm ${
                        request.status === 0 ? 'bg-yellow-100 text-yellow-800' :
                        request.status === 1 ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {request.status === 0 ? 'Pending' :
                         request.status === 1 ? 'Approved' :
                         'Rejected'}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">
                      Requested on: {new Date(parseInt(request.timestamp) * 1000).toLocaleString()}
                    </p>
                    {request.status === 1 && request.ipfsHash && (
                      <div className="mt-2 flex space-x-2">
                        <button
                          onClick={() => handleViewData(request.ipfsHash)}
                          className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-1"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          <span>View Data</span>
                        </button>
                        <a
                          href={`https://gateway.pinata.cloud/ipfs/${request.ipfsHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 text-sm bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 flex items-center space-x-1"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          <span>Open in IPFS</span>
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">
                No purchase requests yet
              </p>
            )}
          </div>
        )}
      </div>
      <Toaster position="top-center" />
      <DataModal />
    </div>
  );
};

export default CarbonCreditMarketplace;