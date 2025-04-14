'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ethers } from 'ethers';
import toast, { Toaster } from 'react-hot-toast';
import { carbonCreditContractAddress, carbonCreditContractAbi } from '@/Utils/carbonCreditConfig';

const CarbonCreditRegistration = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState('farmer'); // 'farmer' or 'auditor'
  
  // Farmer form state
  const [farmerId, setFarmerId] = useState('');
  const [farmerName, setFarmerName] = useState('');
  const [farmerExperience, setFarmerExperience] = useState('');
  const [farmerLandSize, setFarmerLandSize] = useState('');
  const [farmerLocation, setFarmerLocation] = useState('');
  
  // Auditor form state
  const [companyId, setCompanyId] = useState('');
  const [auditorName, setAuditorName] = useState('');
  const [auditorExperience, setAuditorExperience] = useState('');

  const handleFarmerRegistration = async (e) => {
    e.preventDefault();
    
    if (!window.ethereum) {
      toast.error('Please install MetaMask!');
      return;
    }

    try {
      setIsLoading(true);
      
      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });
      
      if (accounts.length === 0) {
        toast.error('No accounts found');
        return;
      }
      
      const userAddress = accounts[0];
      
      // Create contract instance
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(carbonCreditContractAddress, carbonCreditContractAbi, signer);
      
      // Register farmer
      const tx = await contract.registerFarmer(
        farmerId,
        farmerName,
        ethers.utils.parseUnits(farmerExperience, 0),
        ethers.utils.parseUnits(farmerLandSize, 0),
        farmerLocation
      );
      
      await tx.wait();
      
      toast.success('Farmer registered successfully!');
      localStorage.setItem('carbonCreditUserAddress', userAddress);
      router.push('/carbon-credit/dashboard/farmer');
      
    } catch (err) {
      console.error(err);
      toast.error(`Registration failed: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuditorRegistration = async (e) => {
    e.preventDefault();
    
    if (!window.ethereum) {
      toast.error('Please install MetaMask!');
      return;
    }

    try {
      setIsLoading(true);
      
      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });
      
      if (accounts.length === 0) {
        toast.error('No accounts found');
        return;
      }
      
      const userAddress = accounts[0];
      
      // Create contract instance
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(carbonCreditContractAddress, carbonCreditContractAbi, signer);
      
      // Register auditor
      const tx = await contract.registerAuditor(
        companyId,
        auditorName,
        ethers.utils.parseUnits(auditorExperience, 0)
      );
      
      await tx.wait();
      
      toast.success('Auditor registered successfully!');
      localStorage.setItem('carbonCreditUserAddress', userAddress);
      router.push('/carbon-credit/dashboard/auditor');
      
    } catch (err) {
      console.error(err);
      toast.error(`Registration failed: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center text-black mb-6">CarbonCreditNFT Registration</h1>
      
      <div className="mb-6">
        <div className="flex border rounded-lg overflow-hidden">
          <button
            onClick={() => setUserType('farmer')}
            className={`flex-1 py-2 text-center ${
              userType === 'farmer' 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Farmer
          </button>
          <button
            onClick={() => setUserType('auditor')}
            className={`flex-1 py-2 text-center ${
              userType === 'auditor' 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Auditor
          </button>
        </div>
      </div>
      
      {userType === 'farmer' ? (
        <form onSubmit={handleFarmerRegistration} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Farmer ID</label>
            <input
              type="text"
              value={farmerId}
              onChange={(e) => setFarmerId(e.target.value)}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={farmerName}
              onChange={(e) => setFarmerName(e.target.value)}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-1">Experience (years)</label>
            <input
              type="number"
              value={farmerExperience}
              onChange={(e) => setFarmerExperience(e.target.value)}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
              min="0"
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-1">Land Size (acres)</label>
            <input
              type="number"
              value={farmerLandSize}
              onChange={(e) => setFarmerLandSize(e.target.value)}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
              min="0"
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-1">Location</label>
            <input
              type="text"
              value={farmerLocation}
              onChange={(e) => setFarmerLocation(e.target.value)}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 px-4 rounded-lg text-white font-bold ${
              isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {isLoading ? 'Registering...' : 'Register as Farmer'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleAuditorRegistration} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Company ID</label>
            <input
              type="text"
              value={companyId}
              onChange={(e) => setCompanyId(e.target.value)}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={auditorName}
              onChange={(e) => setAuditorName(e.target.value)}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-1">Experience (years)</label>
            <input
              type="number"
              value={auditorExperience}
              onChange={(e) => setAuditorExperience(e.target.value)}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
              min="0"
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 px-4 rounded-lg text-white font-bold ${
              isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {isLoading ? 'Registering...' : 'Register as Auditor'}
          </button>
        </form>
      )}
      
      <div className="mt-6 text-center">
        <button
          onClick={() => router.push('/')}
          className="text-green-600 hover:text-green-800"
        >
          Back to Home
        </button>
      </div>
      
      <Toaster position="top-center" />
    </div>
  );
};

export default CarbonCreditRegistration; 