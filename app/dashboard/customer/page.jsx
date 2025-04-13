'use client';

import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { contractADDRESS, contractAbi } from '@/Utils/config';
import { fetchFromPinata } from '@/Utils/pinata';

export default function CustomerDashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [nftId, setNftId] = useState('');
  const [productHistory, setProductHistory] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [traceDataMap, setTraceDataMap] = useState({});
  const [visibleStages, setVisibleStages] = useState([]);
  const [animationComplete, setAnimationComplete] = useState(false);

  // Check if user is logged in
  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const userAddress = localStorage.getItem('userAddress');
        if (!userAddress) {
          router.push('/');
          return;
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error checking user status:', error);
        toast.error('Error verifying user status');
      } finally {
        setIsLoading(false);
      }
    };

    checkUserStatus();
  }, [router]);

  // Function to fetch trace data from IPFS
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

  // Function to search for NFT history
  const searchNFT = async () => {
    if (!nftId.trim()) {
      toast.error('Please enter a valid NFT ID');
      return;
    }

    try {
      setIsSearching(true);
      setVisibleStages([]);
      setAnimationComplete(false);
      
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(contractADDRESS, contractAbi, provider);
      
      // Get product history from the smart contract
      const history = await contract.getProductHistory(nftId);
      
      if (history.length === 0) {
        toast.error('No history found for this NFT ID');
        setProductHistory(null);
        return;
      }

      // Process the history data
      const processedHistory = await Promise.all(history.map(async (record) => {
        let traceData = null;
        if (record.metadataCID) {
          traceData = await fetchTraceData(record.metadataCID);
        }
        
        return {
          ...record,
          actor: record.actor,
          stage: record.stage,
          timestamp: new Date(record.timestamp * 1000).toLocaleString(),
          metadataCID: record.metadataCID,
          traceData
        };
      }));

      setProductHistory(processedHistory);
      
      // Start the animation sequence
      animateStages(processedHistory);
      
      toast.success('NFT history loaded successfully');
    } catch (error) {
      console.error('Error searching NFT:', error);
      toast.error(`Error: ${error.reason || error.message}`);
      setProductHistory(null);
    } finally {
      setIsSearching(false);
    }
  };

  // Function to animate the stages with a delay
  const animateStages = (history) => {
    if (!history || history.length === 0) return;
    
    // Reset visible stages
    setVisibleStages([]);
    
    // Animate each stage with a delay
    history.forEach((_, index) => {
      setTimeout(() => {
        setVisibleStages(prev => [...prev, index]);
        
        // If this is the last stage, mark animation as complete
        if (index === history.length - 1) {
          setTimeout(() => {
            setAnimationComplete(true);
          }, 300);
        }
      }, index * 800); // Reduced from 2000ms to 800ms for faster animation
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('userAddress');
    router.push('/');
    toast.success('Logged out successfully');
  };
  
  // Function to get stage name based on stage number
  const getStageName = (stage) => {
    switch (stage) {
      case 0:
        return 'Farmer';
      case 1:
        return 'Transporter';
      case 2:
        return 'Warehouse';
      case 3:
        return 'Retailer';
      default:
        return `Stage ${stage}`;
    }
  };

  // Function to get stage color based on stage number
  const getStageColor = (stage) => {
    switch (stage) {
      case 0:
        return 'bg-green-500';
      case 1:
        return 'bg-blue-500';
      case 2:
        return 'bg-orange-500';
      case 3:
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Function to get stage gradient color based on stage number
  const getStageGradientColor = (stage) => {
    switch (stage) {
      case 0:
        return 'from-green-500';
      case 1:
        return 'from-blue-500';
      case 2:
        return 'from-orange-500';
      case 3:
        return 'from-purple-500';
      default:
        return 'from-gray-500';
    }
  };

  // Function to get next stage gradient color
  const getNextStageGradientColor = (stage) => {
    switch (stage) {
      case 0:
        return 'to-blue-500';
      case 1:
        return 'to-orange-500';
      case 2:
        return 'to-purple-500';
      case 3:
        return 'to-purple-500';
      default:
        return 'to-gray-500';
    }
  };

  // Add CSS for animations
  useEffect(() => {
    // Add animation styles to the document
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      @keyframes lineGrow {
        from { height: 0; }
        to { height: 100%; }
      }
      
      .timeline-item {
        opacity: 0;
        transform: translateY(10px);
        transition: all 0.3s ease;
      }
      
      .timeline-item.visible {
        opacity: 1;
        transform: translateY(0);
      }
      
      .timeline-line {
        height: 0;
        transition: height 0.5s ease;
      }
      
      .timeline-line.visible {
        height: 100%;
      }

      .stage-badge {
        transition: all 0.3s ease;
      }

      .stage-badge:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }

      .trace-data-button {
        transition: all 0.2s ease;
      }

      .trace-data-button:hover {
        transform: translateY(-1px);
        text-decoration: underline;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center">
        <div className="text-2xl text-black">Loading...</div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Customer Dashboard</h1>
          <button
            onClick={handleLogout}
            className="text-white bg-red-600 hover:bg-red-500 px-6 py-2 rounded-lg transition duration-200 shadow-md hover:shadow-lg"
          >
            Logout
          </button>
        </div>

        {/* NFT Search Section */}
        <div className="bg-white p-8 rounded-xl shadow-lg mb-8 border border-gray-100">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Search NFT History</h2>
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Enter NFT ID"
              className="p-3 border border-gray-200 rounded-lg text-gray-800 flex-grow focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition duration-200"
              value={nftId}
              onChange={(e) => setNftId(e.target.value)}
            />
            <button
              onClick={searchNFT}
              disabled={isSearching}
              className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition duration-200 shadow-md hover:shadow-lg disabled:hover:shadow-none"
            >
              {isSearching ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>

        {/* NFT History Section */}
        {productHistory && (
          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">NFT History</h2>
            <div className="relative">
              {/* Timeline line */}
              <div className={`absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b ${productHistory && productHistory.length > 0 ? `${getStageGradientColor(productHistory[0].stage)} ${getNextStageGradientColor(productHistory[productHistory.length - 1].stage)}` : 'from-gray-500 to-gray-500'} timeline-line ${animationComplete ? 'visible' : ''}`}></div>
              
              <div className="space-y-6">
                {productHistory.map((record, index) => (
                  <div 
                    key={index} 
                    className={`relative pl-16 timeline-item ${visibleStages.includes(index) ? 'visible' : ''}`}
                    style={{ 
                      transitionDelay: `${index * 0.3}s`,
                      animation: visibleStages.includes(index) ? 'fadeIn 0.3s forwards' : 'none'
                    }}
                  >
                    {/* Stage circle */}
                    <div 
                      className={`absolute left-6 w-4 h-4 rounded-full ${getStageColor(record.stage)} transform -translate-x-1/2 z-10 shadow-md`}
                      style={{ 
                        transition: 'all 0.3s ease',
                        transform: visibleStages.includes(index) ? 'scale(1)' : 'scale(0)',
                        transitionDelay: `${index * 0.3}s`
                      }}
                    ></div>
                    
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center mb-3">
                            <span 
                              className={`px-4 py-1.5 rounded-full text-sm font-medium text-white ${getStageColor(record.stage)} stage-badge`}
                              style={{ 
                                transition: 'all 0.3s ease',
                                opacity: visibleStages.includes(index) ? 1 : 0,
                                transform: visibleStages.includes(index) ? 'translateY(0)' : 'translateY(10px)',
                                transitionDelay: `${index * 0.3 + 0.1}s`
                              }}
                            >
                              {getStageName(record.stage)}
                            </span>
                            <span 
                              className="ml-3 text-sm text-gray-500"
                              style={{ 
                                transition: 'all 0.3s ease',
                                opacity: visibleStages.includes(index) ? 1 : 0,
                                transitionDelay: `${index * 0.3 + 0.2}s`
                              }}
                            >
                              Stage {record.stage}
                            </span>
                          </div>
                          <p 
                            className="text-gray-700 text-sm mb-2"
                            style={{ 
                              transition: 'all 0.3s ease',
                              opacity: visibleStages.includes(index) ? 1 : 0,
                              transitionDelay: `${index * 0.3 + 0.3}s`
                            }}
                          >
                            Actor: {record.actor.substring(0, 6)}...{record.actor.substring(record.actor.length - 4)}
                          </p>
                          <p 
                            className="text-gray-600 text-sm"
                            style={{ 
                              transition: 'all 0.3s ease',
                              opacity: visibleStages.includes(index) ? 1 : 0,
                              transitionDelay: `${index * 0.3 + 0.4}s`
                            }}
                          >
                            Timestamp: {record.timestamp}
                          </p>
                        </div>
                        {record.metadataCID && (
                          <button
                            onClick={async () => {
                              const data = await fetchTraceData(record.metadataCID);
                              if (data) {
                                // Display the data in a modal
                                const dataDisplay = document.createElement('div');
                                dataDisplay.innerHTML = `
                                  <div style="padding: 24px; background: white; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); max-width: 600px; margin: 20px auto;">
                                    <h3 style="margin-top: 0; color: #1a202c; font-size: 1.25rem; margin-bottom: 16px;">Trace Data for ${getStageName(record.stage)}</h3>
                                    <pre style="background: #f7fafc; padding: 16px; border-radius: 8px; overflow: auto; color: #2d3748; font-size: 0.875rem; border: 1px solid #e2e8f0;">
                                      ${JSON.stringify(data, null, 2)}
                                    </pre>
                                    <button onclick="this.parentElement.remove()" style="margin-top: 16px; padding: 8px 16px; background: #e53e3e; color: white; border: none; border-radius: 6px; cursor: pointer; transition: all 0.2s ease;">
                                      Close
                                    </button>
                                  </div>
                                `;
                                document.body.appendChild(dataDisplay);
                              }
                            }}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium trace-data-button"
                            style={{ 
                              transition: 'all 0.3s ease',
                              opacity: visibleStages.includes(index) ? 1 : 0,
                              transitionDelay: `${index * 0.3 + 0.5}s`
                            }}
                          >
                            View Trace Data
                          </button>
                        )}
                      </div>
                      
                      {record.traceData && (
                        <div 
                          className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-100"
                          style={{ 
                            transition: 'all 0.3s ease',
                            opacity: visibleStages.includes(index) ? 1 : 0,
                            transform: visibleStages.includes(index) ? 'translateY(0)' : 'translateY(10px)',
                            transitionDelay: `${index * 0.3 + 0.6}s`
                          }}
                        >
                          <h4 className="font-medium text-gray-800 mb-3 text-sm">Trace Details:</h4>
                          <div className="grid grid-cols-2 gap-3">
                            {record.traceData.attributes && record.traceData.attributes.map((attr, idx) => (
                              <p 
                                key={idx} 
                                className="text-gray-700 text-sm"
                                style={{ 
                                  transition: 'all 0.3s ease',
                                  opacity: visibleStages.includes(index) ? 1 : 0,
                                  transitionDelay: `${index * 0.3 + 0.7 + idx * 0.1}s`
                                }}
                              >
                                <span className="font-medium text-gray-800">{attr.trait_type}:</span> {attr.value}
                              </p>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      <Toaster position="top-center" />
    </div>
  );
}