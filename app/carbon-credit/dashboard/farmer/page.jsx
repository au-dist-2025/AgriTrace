'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ethers } from 'ethers';
import toast, { Toaster } from 'react-hot-toast';
import { carbonCreditContractAddress, carbonCreditContractAbi, carbonCreditPurchaseContractAddress, carbonCreditPurchaseContractAbi, carbonCreditAttestationContractAddress, carbonCreditAttestationContractAbi } from '@/Utils/carbonCreditConfig';
import { uploadToPinata, fetchFromPinata } from '@/Utils/pinata';

const ActiveCreditCard = ({ request, index }) => {
  const [tokenData, setTokenData] = useState({ tokenId: null, balance: null, creditDetails: null });

  useEffect(() => {
    const fetchTokenData = async () => {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(
          carbonCreditContractAddress,
          carbonCreditContractAbi,
          provider
        );
        
        // Get token ID from the request
        const tokenId = request.tokenId;
        
        // Get credit details
        const creditDetails = await contract.getCarbonCredit(tokenId);
        
        // Get balance
        const balance = await contract.balanceOf(
          localStorage.getItem('carbonCreditUserAddress'),
          tokenId
        );
        
        setTokenData({
          tokenId: tokenId.toString(),
          balance: balance.toString(),
          creditDetails
        });
      } catch (error) {
        console.error('Error fetching token data:', error);
      }
    };

    if (request.isMinted) {
      fetchTokenData();
    }
  }, [request, index]);

  return (
    <div className="p-4 bg-green-50 rounded-lg">
      <p className="text-sm text-gray-600">Token ID</p>
      <p className="text-lg font-medium text-black">
        {tokenData.tokenId || 'Loading...'}
      </p>
      <p className="text-sm text-gray-600 mt-2">Amount</p>
      <p className="text-lg font-medium text-black">
        {tokenData.creditDetails ? tokenData.creditDetails.amount.toString() : request.carbonAmount.toString()} tons
      </p>
      <p className="text-sm text-gray-600 mt-2">Available Balance</p>
      <p className="text-lg font-medium text-black">
        {tokenData.balance !== null ? `${tokenData.balance} tokens` : 'Loading...'}
      </p>
      <p className="text-sm text-gray-600 mt-2">IPFS Hash</p>
      <p className="text-sm font-mono text-black truncate">
        {tokenData.creditDetails ? tokenData.creditDetails.ipfsHash : request.ipfsHash}
      </p>
      {tokenData.creditDetails && (
        <p className="text-sm text-gray-600 mt-2">
          Status: {tokenData.creditDetails.isActive ? 'Active' : 'Inactive'}
        </p>
      )}
    </div>
  );
};

const FarmerDashboard = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [farmerData, setFarmerData] = useState(null);
  const [carbonRequests, setCarbonRequests] = useState([]);
  const [activeCredits, setActiveCredits] = useState([]);
  const [purchaseRequests, setPurchaseRequests] = useState([]);
  const [showClaimForm, setShowClaimForm] = useState(false);
  const [claimFormData, setClaimFormData] = useState({
    farmer_id: '',
    project_type: '',
    farmer: {
      name: '',
      aadhaar_last4: '',
      location: ''
    },
    project: {
      start_date: '',
      area_acres: '',
      practice: '',
      method: ''
    },
    baseline: {
      land_use: '',
      emissions: '',
      yield: ''
    },
    current: {
      claimable_carbon_credit: '',
      evidence: ''
    },
    monitoring: {
      last_update: '',
      tree_survival: '',
      notes: ''
    }
  });
  const [pinataCredentials, setPinataCredentials] = useState({
    apiKey: process.env.NEXT_PUBLIC_PINATA_API_KEY || '',
    apiSecret: process.env.NEXT_PUBLIC_PINATA_API_SECRET || ''
  });
  const [isPinataValid, setIsPinataValid] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [selectedVerifiedCredit, setSelectedVerifiedCredit] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const userAddress = localStorage.getItem('carbonCreditUserAddress');
      if (!userAddress) {
        router.push('/');
        return;
      }

      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const carbonContract = new ethers.Contract(
          carbonCreditContractAddress,
          carbonCreditContractAbi,
          provider
        );
        
        const farmer = await carbonContract.farmers(userAddress);
        
        if (!farmer.isRegistered) {
          router.push('/carbon-credit/registration');
          return;
        }
        
        setFarmerData(farmer);
        
        // Fetch carbon requests and update their minted status
        const requests = [];
        let index = 0;
        while (true) {
          try {
            const request = await carbonContract.carbonRequests(userAddress, index);
            const isMinted = await carbonContract.isCreditMinted(userAddress, index);
            const updatedRequest = {
              ...request,
              isMinted: isMinted
            };
            requests.push(updatedRequest);
            index++;
          } catch (error) {
            break;
          }
        }
        setCarbonRequests(requests);
        
        // Fetch active credits
        const activeCredits = [];
        for (let i = 0; i < requests.length; i++) {
          try {
            const isMinted = await carbonContract.isCreditMinted(userAddress, i);
            if (isMinted) {
              const balance = await carbonContract.balanceOf(userAddress, i);
              if (balance.gt(0)) {
                activeCredits.push(i);
              }
            }
          } catch (error) {
            console.error(`Error checking credit ${i}:`, error);
            continue;
          }
        }
        setActiveCredits(activeCredits);

        // Fetch purchase requests with improved error handling
        try {
          console.log('Fetching purchase requests for farmer:', userAddress);
          const purchaseContract = new ethers.Contract(
            carbonCreditPurchaseContractAddress,
            carbonCreditPurchaseContractAbi,
            provider
          );

          // Listen for purchase request status updates
          purchaseContract.on("PurchaseRequestHandled", (buyer, farmer, tokenId, amount, status, requestIndex) => {
            if (farmer.toLowerCase() === userAddress.toLowerCase()) {
              console.log('Purchase request status updated:', {
                buyer,
                farmer,
                tokenId: tokenId.toString(),
                amount: amount.toString(),
                status: status.toString(),
                requestIndex: requestIndex.toString()
              });
              
              // Update the request status in local state
              setPurchaseRequests(prev => prev.map(req => 
                req.index === requestIndex.toString() 
                  ? { ...req, status: status.toNumber() }
                  : req
              ));
            }
          });

          // Get the next request index for this farmer
          const nextFarmerIndex = await purchaseContract.nextFarmerRequestIndex(userAddress);
          console.log('Next farmer request index:', nextFarmerIndex.toString());

          // Fetch all requests
          const allRequests = [];
          
          // We'll check the last 100 requests from all buyers to find ones for this farmer
          // This is a temporary solution - in production, we should implement proper indexing in the smart contract
          const potentialBuyers = await Promise.all(
            Array.from({ length: 10 }, async (_, i) => {
              try {
                const event = await purchaseContract.queryFilter(
                  purchaseContract.filters.PurchaseRequestCreated(null, userAddress),
                  -10000
                );
                return [...new Set(event.map(e => e.args.buyer))];
              } catch (error) {
                console.error('Error fetching events:', error);
                return [];
              }
            })
          );

          const buyers = [...new Set(potentialBuyers.flat())];
          console.log('Found buyers:', buyers);

          for (const buyer of buyers) {
            try {
              // Get purchase requests for this buyer
              const [indices, farmers, tokenIds, amounts, statuses, timestamps] = await purchaseContract.getBuyerPurchaseRequests(buyer);
              
              // Filter requests for this farmer
              for (let i = 0; i < indices.length; i++) {
                if (farmers[i].toLowerCase() === userAddress.toLowerCase()) {
                  allRequests.push({
                    index: indices[i].toString(),
                    buyer: buyer,
                    tokenId: tokenIds[i].toString(),
                    amount: amounts[i].toString(),
                    status: statuses[i].toNumber(),
                    timestamp: timestamps[i].toString()
                  });
                }
              }
            } catch (error) {
              console.error(`Error fetching requests for buyer ${buyer}:`, error);
              continue;
            }
          }

          console.log('All valid purchase requests:', allRequests);
          setPurchaseRequests(allRequests);

        } catch (error) {
          console.error('Error fetching purchase requests:', error);
          toast.error('Failed to fetch purchase requests');
        }
      } catch (err) {
        console.error(err);
        toast.error('Error fetching farmer data');
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();

    // Set up interval for periodic updates
    const interval = setInterval(checkAuth, 15000); // Update every 15 seconds

    // Cleanup function for event listeners
    return () => {
      clearInterval(interval);
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const purchaseContract = new ethers.Contract(
          carbonCreditPurchaseContractAddress,
          carbonCreditPurchaseContractAbi,
          provider
        );
        purchaseContract.removeAllListeners("PurchaseRequestHandled");
      }
    };
  }, [router]);

  useEffect(() => {
    // Simple validation for Pinata credentials
    const isValid = pinataCredentials.apiKey.length > 0 && pinataCredentials.apiSecret.length > 0;
    setIsPinataValid(isValid);
  }, [pinataCredentials]);

  const handleClaimFormChange = (section, field, value) => {
    if (section) {
      setClaimFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
    } else {
      setClaimFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleClaimSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Validate Pinata credentials first
      if (!isPinataValid) {
        throw new Error('Pinata API credentials are not configured properly. Please check your .env.local file.');
      }

      // Get claimable carbon credit amount as integer
      const claimableAmount = parseInt(claimFormData.current.claimable_carbon_credit);
      if (isNaN(claimableAmount) || claimableAmount <= 0) {
        throw new Error('Invalid claimable carbon credit amount');
      }

      // Structure metadata for IPFS
      const metadata = {
        name: `Carbon Credit Claim #${Date.now()}`,
        description: "Carbon Credit Claim Data",
        farmer_details: {
          id: claimFormData.farmer_id,
          name: claimFormData.farmer.name,
          aadhaar_last4: claimFormData.farmer.aadhaar_last4,
          location: claimFormData.farmer.location
        },
        project_details: {
          type: claimFormData.project_type,
          start_date: claimFormData.project.start_date,
          area_acres: claimFormData.project.area_acres,
          practice: claimFormData.project.practice,
          method: claimFormData.project.method
        },
        baseline_data: {
          land_use: claimFormData.baseline.land_use,
          emissions: claimFormData.baseline.emissions,
          yield: claimFormData.baseline.yield
        },
        current_data: {
          claimable_carbon_credit: claimFormData.current.claimable_carbon_credit,
          evidence: claimFormData.current.evidence
        },
        monitoring_data: {
          last_update: claimFormData.monitoring.last_update,
          tree_survival: claimFormData.monitoring.tree_survival,
          notes: claimFormData.monitoring.notes
        },
        timestamp: new Date().toISOString()
      };

      // Upload metadata to IPFS using Pinata with credentials
      const metadataCID = await uploadToPinata(
        metadata,
        pinataCredentials.apiKey,
        pinataCredentials.apiSecret
      );
      
      // Interact with the smart contract
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        carbonCreditContractAddress,
        carbonCreditContractAbi,
        signer
      );

      // Call the claimCarbonCredit function with the IPFS hash and claimable amount
      const tx = await contract.claimCarbonCredit(
        metadataCID,
        claimableAmount
      );

      // Wait for transaction confirmation
      await tx.wait();
      
      // Reset form and toggle
      setShowClaimForm(false);
      setClaimFormData({
        farmer_id: '',
        project_type: '',
        farmer: {
          name: '',
          aadhaar_last4: '',
          location: ''
        },
        project: {
          start_date: '',
          area_acres: '',
          practice: '',
          method: ''
        },
        baseline: {
          land_use: '',
          emissions: '',
          yield: ''
        },
        current: {
          claimable_carbon_credit: '',
          evidence: ''
        },
        monitoring: {
          last_update: '',
          tree_survival: '',
          notes: ''
        }
      });
      
      toast.success('Carbon credit claim submitted successfully!');
      
      // Refresh the dashboard data
      const userAddress = localStorage.getItem('carbonCreditUserAddress');
      if (userAddress) {
        const farmer = await contract.farmers(userAddress);
        setFarmerData(farmer);
        
        // Fetch updated carbon requests
        const requests = [];
        let index = 0;
        while (true) {
          try {
            const request = await contract.carbonRequests(userAddress, index);
            requests.push(request);
            index++;
          } catch (error) {
            break; // No more requests found
          }
        }
        setCarbonRequests(requests);
        
        // Fetch updated active credits
        const activeCredits = [];
        for (let i = 0; i < requests.length; i++) {
          try {
            const isMinted = await contract.isCreditMinted(userAddress, i);
            if (isMinted) {
              const balance = await contract.balanceOf(userAddress, i);
              if (balance.gt(0)) {
                activeCredits.push(i);
              }
            }
          } catch (error) {
            console.error(`Error checking credit ${i}:`, error);
            continue;
          }
        }
        setActiveCredits(activeCredits);
      }
    } catch (error) {
      console.error('Error submitting claim:', error);
      toast.error(error.reason || error.message || 'Failed to submit claim');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('carbonCreditUserAddress');
    router.push('/');
    toast.success('Logged out successfully');
  };

  const handleMintNFT = async (index) => {
    if (!window.ethereum) {
      toast.error('Please install MetaMask!');
      return;
    }

    try {
      setIsMinting(true);
      const userAddress = localStorage.getItem('carbonCreditUserAddress');
      if (!userAddress) {
        router.push('/');
        return;
      }

      // Create contract instance
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        carbonCreditContractAddress,
        carbonCreditContractAbi,
        provider
      );

      // Check if the NFT has already been minted
      const isMinted = await contract.isCreditMinted(userAddress, index);
      if (isMinted) {
        toast.error('NFT has already been minted for this carbon credit request.');
        setIsMinting(false);
        return;
      }

      // Get the IPFS hash from the verified carbon credit request
      const ipfsHash = carbonRequests[index].ipfsHash;

      // Create metadata for the NFT
      const metadata = {
        name: `Carbon Credit #${index + 1}`,
        description: "Carbon Credit NFT",
        image: "ipfs://" + ipfsHash,
        attributes: [
          {
            trait_type: "Farmer",
            value: farmerData.name
          },
          {
            trait_type: "Amount",
            value: carbonRequests[index].carbonAmount.toString()
          },
          {
            trait_type: "Verification Date",
            value: new Date().toISOString()
          }
        ]
      };

      // Upload metadata to IPFS
      const metadataCID = await uploadToPinata(
        metadata,
        pinataCredentials.apiKey,
        pinataCredentials.apiSecret
      );

      // Get the signer and create contract instance
      const signer = provider.getSigner();
      const contractWithSigner = contract.connect(signer);

      // Mint the NFT using the index and metadata URI
      const tx = await contractWithSigner.mintCarbonCredit(
        index,
        "ipfs://" + metadataCID
      );

      await tx.wait();
      toast.success('NFT minted successfully!');
      
      // Refresh the dashboard data
      const farmer = await contract.farmers(userAddress);
      setFarmerData(farmer);
      
      // Fetch updated carbon requests and update their minted status
      const requests = [];
      let idx = 0;
      while (true) {
        try {
          const request = await contract.carbonRequests(userAddress, idx);
          // Check if this request is minted
          const isMinted = await contract.isCreditMinted(userAddress, idx);
          // Create a new request object with updated minted status
          const updatedRequest = {
            ...request,
            isMinted: isMinted
          };
          requests.push(updatedRequest);
          idx++;
        } catch (error) {
          break;
        }
      }
      setCarbonRequests(requests);
      
      // Fetch updated active credits
      const activeCredits = [];
      for (let i = 0; i < requests.length; i++) {
        try {
          const isMinted = await contract.isCreditMinted(userAddress, i);
          if (isMinted) {
            const balance = await contract.balanceOf(userAddress, i);
            if (balance.gt(0)) {
              activeCredits.push(i);
            }
          }
        } catch (error) {
          console.error(`Error checking credit ${i}:`, error);
          continue;
        }
      }
      setActiveCredits(activeCredits);

    } catch (err) {
      console.error(err);
      toast.error(`Minting failed: ${err.message}`);
    } finally {
      setIsMinting(false);
      setSelectedVerifiedCredit(null);
    }
  };

  // Update the purchase requests section in the JSX to remove attestation button
  const PurchaseRequestsSection = () => (
    <div className="bg-white p-6 rounded-xl shadow-sm mb-8 border border-gray-100">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Purchase Requests</h2>
      {purchaseRequests && purchaseRequests.length > 0 ? (
        <div className="space-y-4">
          {purchaseRequests.map((request) => (
            <div
              key={`${request.buyer}-${request.index}`}
              className="bg-gray-50 p-4 rounded-lg border border-gray-200"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-sm text-gray-600">Token ID: #{request.tokenId}</p>
                  <p className="text-sm text-gray-600">Amount: {request.amount} credits</p>
                  <p className="text-sm text-gray-600">
                    Buyer: {request.buyer.substring(0, 6)}...{request.buyer.substring(38)}
                  </p>
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
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">
          No purchase requests yet
        </p>
      )}
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center">
        <div className="text-2xl text-green-800">Loading...</div>
      </div>
    );
  }

  if (!farmerData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Farmer Dashboard</h1>
          <div className="flex space-x-4">
            <button
              onClick={() => setShowClaimForm(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 shadow-sm"
            >
              Claim Carbon Credit
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 shadow-sm"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Farmer Information Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm mb-8 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Farmer Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
              <p className="text-sm text-gray-600">Farmer ID</p>
              <p className="text-lg font-medium text-gray-900">{farmerData.farmerId}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
              <p className="text-sm text-gray-600">Name</p>
              <p className="text-lg font-medium text-gray-900">{farmerData.name}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
              <p className="text-sm text-gray-600">Experience</p>
              <p className="text-lg font-medium text-gray-900">{farmerData.experience.toString()} years</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
              <p className="text-sm text-gray-600">Land Size</p>
              <p className="text-lg font-medium text-gray-900">{farmerData.landSize.toString()} acres</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
              <p className="text-sm text-gray-600">Location</p>
              <p className="text-lg font-medium text-gray-900">{farmerData.location}</p>
            </div>
          </div>
        </div>

        {/* Active Carbon Credits */}
        <div className="bg-white p-6 rounded-xl shadow-sm mb-8 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Active Carbon Credits</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {carbonRequests.filter(request => request.isMinted).length > 0 ? (
              carbonRequests.map((request, index) => {
                if (request.isMinted) {
                  return (
                    <ActiveCreditCard
                      key={index}
                      request={request}
                      index={index}
                    />
                  );
                }
                return null;
              })
            ) : (
              <p className="col-span-full text-center text-gray-500 py-4">
                No active carbon credits yet
              </p>
            )}
          </div>
        </div>

        {/* Carbon Credits Summary */}
        <div className="bg-white p-6 rounded-xl shadow-sm mb-8 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Carbon Credits Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-100">
              <p className="text-sm text-gray-600">Pending Requests</p>
              <p className="text-lg font-medium text-gray-900">{carbonRequests.filter(req => !req.isVerified).length}</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg border border-green-100">
              <p className="text-sm text-gray-600">Verified Requests</p>
              <p className="text-lg font-medium text-gray-900">{carbonRequests.filter(req => req.isVerified).length}</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg border border-green-100">
              <p className="text-sm text-gray-600">Active Credits</p>
              <p className="text-lg font-medium text-gray-900">{carbonRequests.filter(req => req.isMinted).length}</p>
            </div>
          </div>
        </div>

        {/* Purchase Requests Section */}
        <PurchaseRequestsSection />

        {/* Claim Form Modal */}
        {showClaimForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Claim Carbon Credit</h2>
                <button
                  onClick={() => setShowClaimForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleClaimSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Farmer ID</label>
                    <input
                      type="text"
                      value={claimFormData.farmer_id}
                      onChange={(e) => handleClaimFormChange(null, 'farmer_id', e.target.value)}
                      className="w-full p-2 border rounded text-gray-900"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Project Type</label>
                    <input
                      type="text"
                      value={claimFormData.project_type}
                      onChange={(e) => handleClaimFormChange(null, 'project_type', e.target.value)}
                      className="w-full p-2 border rounded text-gray-900"
                      required
                    />
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="text-lg font-semibold mb-3 text-gray-900">Farmer Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input
                        type="text"
                        value={claimFormData.farmer.name}
                        onChange={(e) => handleClaimFormChange('farmer', 'name', e.target.value)}
                        className="w-full p-2 border rounded text-gray-900"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Aadhaar Last 4</label>
                      <input
                        type="text"
                        value={claimFormData.farmer.aadhaar_last4}
                        onChange={(e) => handleClaimFormChange('farmer', 'aadhaar_last4', e.target.value)}
                        className="w-full p-2 border rounded text-gray-900"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                      <input
                        type="text"
                        value={claimFormData.farmer.location}
                        onChange={(e) => handleClaimFormChange('farmer', 'location', e.target.value)}
                        className="w-full p-2 border rounded text-gray-900"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="text-lg font-semibold mb-3 text-gray-900">Project Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                      <input
                        type="date"
                        value={claimFormData.project.start_date}
                        onChange={(e) => handleClaimFormChange('project', 'start_date', e.target.value)}
                        className="w-full p-2 border rounded text-gray-900"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Area (acres)</label>
                      <input
                        type="number"
                        value={claimFormData.project.area_acres}
                        onChange={(e) => handleClaimFormChange('project', 'area_acres', e.target.value)}
                        className="w-full p-2 border rounded text-gray-900"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Practice</label>
                      <input
                        type="text"
                        value={claimFormData.project.practice}
                        onChange={(e) => handleClaimFormChange('project', 'practice', e.target.value)}
                        className="w-full p-2 border rounded text-gray-900"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Method</label>
                      <input
                        type="text"
                        value={claimFormData.project.method}
                        onChange={(e) => handleClaimFormChange('project', 'method', e.target.value)}
                        className="w-full p-2 border rounded text-gray-900"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="text-lg font-semibold mb-3 text-gray-900">Baseline Data</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Land Use</label>
                      <input
                        type="text"
                        value={claimFormData.baseline.land_use}
                        onChange={(e) => handleClaimFormChange('baseline', 'land_use', e.target.value)}
                        className="w-full p-2 border rounded text-gray-900"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Emissions</label>
                      <input
                        type="text"
                        value={claimFormData.baseline.emissions}
                        onChange={(e) => handleClaimFormChange('baseline', 'emissions', e.target.value)}
                        className="w-full p-2 border rounded text-gray-900"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Yield</label>
                      <input
                        type="text"
                        value={claimFormData.baseline.yield}
                        onChange={(e) => handleClaimFormChange('baseline', 'yield', e.target.value)}
                        className="w-full p-2 border rounded text-gray-900"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="text-lg font-semibold mb-3 text-gray-900">Current Data</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Claimable Carbon Credit</label>
                      <input
                        type="text"
                        value={claimFormData.current.claimable_carbon_credit}
                        onChange={(e) => handleClaimFormChange('current', 'claimable_carbon_credit', e.target.value)}
                        className="w-full p-2 border rounded text-gray-900"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Evidence</label>
                      <textarea
                        value={claimFormData.current.evidence}
                        onChange={(e) => handleClaimFormChange('current', 'evidence', e.target.value)}
                        className="w-full p-2 border rounded text-gray-900"
                        required
                        rows="3"
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="text-lg font-semibold mb-3 text-gray-900">Monitoring</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Last Update</label>
                      <input
                        type="date"
                        value={claimFormData.monitoring.last_update}
                        onChange={(e) => handleClaimFormChange('monitoring', 'last_update', e.target.value)}
                        className="w-full p-2 border rounded text-gray-900"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tree Survival Rate</label>
                      <input
                        type="text"
                        value={claimFormData.monitoring.tree_survival}
                        onChange={(e) => handleClaimFormChange('monitoring', 'tree_survival', e.target.value)}
                        className="w-full p-2 border rounded text-gray-900"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                      <textarea
                        value={claimFormData.monitoring.notes}
                        onChange={(e) => handleClaimFormChange('monitoring', 'notes', e.target.value)}
                        className="w-full p-2 border rounded text-gray-900"
                        required
                        rows="3"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowClaimForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-green-300"
                  >
                    {isLoading ? 'Submitting...' : 'Submit Claim'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
      <Toaster position="top-center" />
    </div>
  );
};

export default FarmerDashboard; 