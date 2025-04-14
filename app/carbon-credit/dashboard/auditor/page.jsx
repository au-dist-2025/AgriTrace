'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ethers } from 'ethers';
import toast, { Toaster } from 'react-hot-toast';
import { carbonCreditContractAddress, carbonCreditContractAbi } from '@/Utils/carbonCreditConfig';
import { fetchFromPinata } from '@/Utils/pinata';

const AuditorDashboard = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [auditorData, setAuditorData] = useState(null);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [selectedFarmer, setSelectedFarmer] = useState('');
  const [selectedRequestIndex, setSelectedRequestIndex] = useState(null);
  const [farmerAddresses, setFarmerAddresses] = useState([]);
  const [farmerDetails, setFarmerDetails] = useState({});
  const [showVerificationForm, setShowVerificationForm] = useState(false);
  const [claimDetails, setClaimDetails] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const userAddress = localStorage.getItem('carbonCreditUserAddress');
      if (!userAddress) {
        router.push('/');
        return;
      }

      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(carbonCreditContractAddress, carbonCreditContractAbi, provider);
        
        const auditor = await contract.auditors(userAddress);
        
        if (!auditor.isRegistered) {
          router.push('/carbon-credit/registration');
          return;
        }
        
        setAuditorData(auditor);
        
        // Get farmer registration events
        const filter = contract.filters.FarmerRegistered();
        const events = await contract.queryFilter(filter);
        
        // Process events to get farmer addresses
        const farmerAddresses = events.map(event => event.args[0]);
        
        // Fetch farmer details and their requests
        const details = {};
        const allRequests = [];
        
        for (const address of farmerAddresses) {
          try {
            const farmer = await contract.farmers(address);
            if (farmer.isRegistered) {
              details[address] = farmer;
              
              // Fetch carbon requests for this farmer
              const requests = [];
              let index = 0;
              while (true) {
                try {
                  const request = await contract.carbonRequests(address, index);
                  if (!request.isVerified) {
                    requests.push(request);
                  }
                  index++;
                } catch (error) {
                  break;
                }
              }
              
              if (requests.length > 0) {
                allRequests.push({
                  farmerAddress: address,
                  requests: requests
                });
              }
            }
          } catch (error) {
            console.error(`Error fetching farmer ${address}:`, error);
            continue;
          }
        }
        
        setFarmerAddresses(farmerAddresses);
        setFarmerDetails(details);
        setPendingRequests(allRequests);
        
      } catch (err) {
        console.error(err);
        toast.error('Error fetching auditor data');
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, [router]);

  const fetchClaimDetails = async (ipfsHash) => {
    try {
      const details = await fetchFromPinata(ipfsHash);
      setClaimDetails(details);
    } catch (error) {
      console.error('Error fetching claim details:', error);
      toast.error('Error fetching claim details');
    }
  };

  const handleVerifyCarbonCredit = async (e) => {
    e.preventDefault();
    
    if (!window.ethereum) {
      toast.error('Please install MetaMask!');
      return;
    }

    if (!selectedFarmer || selectedRequestIndex === null) {
      toast.error('Please select a farmer and request');
      return;
    }

    try {
      setIsLoading(true);
      
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

      // Get the signer and create contract instance
      const signer = provider.getSigner();
      const contractWithSigner = contract.connect(signer);
      
      // Verify carbon credit
      const tx = await contractWithSigner.verifyCarbonCredit(
        selectedFarmer,
        selectedRequestIndex
      );
      
      await tx.wait();
      
      toast.success('Carbon credit verified successfully!');
      
      // Refresh data
      const allRequests = [];
      for (const address of farmerAddresses) {
        const requests = [];
        let index = 0;
        while (true) {
          try {
            const request = await contract.carbonRequests(address, index);
            if (!request.isVerified) {
              requests.push(request);
            }
            index++;
          } catch (error) {
            break;
          }
        }
        
        if (requests.length > 0) {
          allRequests.push({
            farmerAddress: address,
            requests: requests
          });
        }
      }
      
      setPendingRequests(allRequests);
      
      // Reset form
      setSelectedFarmer('');
      setSelectedRequestIndex(null);
      setShowVerificationForm(false);
      setClaimDetails(null);
      
    } catch (err) {
      console.error(err);
      toast.error(`Verification failed: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('carbonCreditUserAddress');
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-black">Auditor Dashboard</h1>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-gray-50 p-6 rounded-xl shadow-md border border-gray-200">
              <h2 className="text-xl font-semibold mb-4 text-black">Auditor Information</h2>
              <div className="space-y-3">
                <p className="flex justify-between">
                  <span className="font-medium text-gray-700">Company ID:</span>
                  <span className="text-black">{auditorData.companyId}</span>
                </p>
                <p className="flex justify-between">
                  <span className="font-medium text-gray-700">Name:</span>
                  <span className="text-black">{auditorData.name}</span>
                </p>
                <p className="flex justify-between">
                  <span className="font-medium text-gray-700">Experience:</span>
                  <span className="text-black">{auditorData.experience.toString()} years</span>
                </p>
              </div>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-xl shadow-md border border-gray-200">
              <h2 className="text-xl font-semibold mb-4 text-black">Verification Summary</h2>
              <div className="space-y-3">
                <p className="flex justify-between">
                  <span className="font-medium text-gray-700">Pending Requests:</span>
                  <span className="text-yellow-600 font-semibold">
                    {pendingRequests.reduce((total, item) => total + item.requests.length, 0)}
                  </span>
                </p>
              </div>
            </div>
          </div>
          
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-black">Carbon Credit Verification</h2>
              <button
                onClick={() => setShowVerificationForm(!showVerificationForm)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                {showVerificationForm ? 'Hide Form' : 'Show Verification Form'}
              </button>
            </div>
            
            {showVerificationForm && (
              <div className="bg-gray-50 p-6 rounded-xl shadow-md border border-gray-200">
                <form onSubmit={handleVerifyCarbonCredit} className="space-y-4">
                  <div>
                    <label className="block text-gray-700 mb-1">Select Farmer</label>
                    <select
                      value={selectedFarmer}
                      onChange={(e) => {
                        setSelectedFarmer(e.target.value);
                        setSelectedRequestIndex(null);
                        setClaimDetails(null);
                      }}
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
                      required
                    >
                      <option value="">Select a farmer</option>
                      {Object.entries(farmerDetails).map(([address, farmer]) => (
                        <option key={address} value={address}>
                          {farmer.name} ({farmer.farmerId})
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-1">Select Request</label>
                    <select
                      value={selectedRequestIndex !== null ? selectedRequestIndex : ''}
                      onChange={(e) => {
                        const index = e.target.value ? parseInt(e.target.value) : null;
                        setSelectedRequestIndex(index);
                        if (index !== null && selectedFarmer) {
                          const request = pendingRequests
                            .find(item => item.farmerAddress === selectedFarmer)
                            ?.requests[index];
                          if (request) {
                            fetchClaimDetails(request.ipfsHash);
                          }
                        } else {
                          setClaimDetails(null);
                        }
                      }}
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
                      required
                      disabled={!selectedFarmer}
                    >
                      <option value="">Select a request</option>
                      {selectedFarmer && pendingRequests.find(item => item.farmerAddress === selectedFarmer)?.requests.map((request, index) => (
                        <option key={index} value={index}>
                          Request #{index} - {request.carbonAmount.toString()} tons
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {claimDetails && (
                    <div className="bg-white p-6 rounded-xl border border-gray-200">
                      <h3 className="text-lg font-semibold mb-4 text-black">Claim Details</h3>
                      <div className="space-y-3">
                        <p className="flex justify-between">
                          <span className="font-medium text-gray-700">Farmer Name:</span>
                          <span className="text-black">{claimDetails.farmer_details.name}</span>
                        </p>
                        <p className="flex justify-between">
                          <span className="font-medium text-gray-700">Project Type:</span>
                          <span className="text-black">{claimDetails.project_details.type}</span>
                        </p>
                        <p className="flex justify-between">
                          <span className="font-medium text-gray-700">Area (acres):</span>
                          <span className="text-black">{claimDetails.project_details.area_acres}</span>
                        </p>
                        <p className="flex justify-between">
                          <span className="font-medium text-gray-700">Practice:</span>
                          <span className="text-black">{claimDetails.project_details.practice}</span>
                        </p>
                        <p className="flex justify-between">
                          <span className="font-medium text-gray-700">Method:</span>
                          <span className="text-black">{claimDetails.project_details.method}</span>
                        </p>
                        <p className="flex justify-between">
                          <span className="font-medium text-gray-700">Claimable Amount:</span>
                          <span className="text-black">{claimDetails.current_data.claimable_carbon_credit} tons</span>
                        </p>
                        <p className="flex justify-between">
                          <span className="font-medium text-gray-700">Evidence:</span>
                          <span className="text-black">{claimDetails.current_data.evidence}</span>
                        </p>
                      </div>
                    </div>
                  )}
                  
                  <button
                    type="submit"
                    disabled={isLoading || !selectedFarmer || selectedRequestIndex === null}
                    className={`w-full py-2 px-4 rounded-lg text-white font-bold ${
                      isLoading || !selectedFarmer || selectedRequestIndex === null ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
                    }`}
                  >
                    {isLoading ? 'Verifying...' : 'Verify Carbon Credit'}
                  </button>
                </form>
              </div>
            )}
          </div>
          
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-6 text-black">Pending Carbon Credit Requests</h2>
            {pendingRequests.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No pending carbon credit requests</p>
            ) : (
              <div className="space-y-6">
                {pendingRequests.map((item, idx) => (
                  <div key={idx} className="bg-gray-50 p-6 rounded-xl shadow-md border border-gray-200">
                    <h3 className="font-semibold mb-4 text-black">
                      Farmer: {farmerDetails[item.farmerAddress]?.name || 'Unknown'} 
                      ({item.farmerAddress.substring(0, 6)}...{item.farmerAddress.substring(38)})
                    </h3>
                    
                    <div className="overflow-x-auto">
                      <table className="min-w-full bg-white">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="py-3 px-4 text-left text-gray-700">Index</th>
                            <th className="py-3 px-4 text-left text-gray-700">IPFS Hash</th>
                            <th className="py-3 px-4 text-left text-gray-700">Amount</th>
                            <th className="py-3 px-4 text-left text-gray-700">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {item.requests.map((request, index) => (
                            <tr key={index} className="border-t">
                              <td className="py-3 px-4 text-black">{index}</td>
                              <td className="py-3 px-4 font-mono text-sm text-black">{request.ipfsHash}</td>
                              <td className="py-3 px-4 text-black">{request.carbonAmount.toString()} tons</td>
                              <td className="py-3 px-4">
                                <span className="px-3 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                                  Pending
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Toaster position="top-center" />
    </div>
  );
};

export default AuditorDashboard; 