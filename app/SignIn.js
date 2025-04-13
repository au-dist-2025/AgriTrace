'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ethers } from 'ethers';
import toast, { Toaster } from 'react-hot-toast';
import { contractADDRESS, contractAbi } from '@/Utils/config';

const SignIn = () => {
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const checkRoles = async (userAddress) => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(contractADDRESS, contractAbi, provider);
      
      const [isFarmer, isTransporter, isWarehouse, isRetailer] = await Promise.all([
        contract.farmers(userAddress),
        contract.transporters(userAddress),
        contract.warehouses(userAddress),
        contract.retailers(userAddress)
      ]);

      return { isFarmer, isTransporter, isWarehouse, isRetailer };
    } catch (err) {
      toast.error(`Error checking roles: ${err.message}`);
      return null;
    }
  };

  const connectToMetamask = async () => {
    if (!window.ethereum) {
      toast.error('Please install MetaMask!');
      return;
    }

    try {
      setIsLoading(true);
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      if (accounts.length === 0) {
        toast.error('No accounts found');
        return;
      }

      const selectedAddress = accounts[0];
      setAddress(selectedAddress);
      localStorage.setItem('userAddress', selectedAddress);
      toast.success('MetaMask Connected');

      // Check roles immediately after connection
      const roles = await checkRoles(selectedAddress);
      if (!roles) return;

      // Redirect if any role exists
      if (roles.isFarmer) router.push('/dashboard/farmer');
      else if (roles.isTransporter) router.push('/dashboard/transporter');
      else if (roles.isWarehouse) router.push('/dashboard/warehouse');
      else if (roles.isRetailer) router.push('/dashboard/retailer');
      
    } catch (err) {
      toast.error(`Connection failed: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProceed = async () => {
    if (!address) {
      toast.error('Please connect wallet first');
      return;
    }

    try {
      setIsLoading(true);
      const roles = await checkRoles(address);
      if (!roles) return;

      // If any role exists, redirect to dashboard
      if (roles.isFarmer) router.push('/dashboard/farmer');
      else if (roles.isTransporter) router.push('/dashboard/transporter');
      else if (roles.isWarehouse) router.push('/dashboard/warehouse');
      else if (roles.isRetailer) router.push('/dashboard/retailer');
      else router.push('/registration'); // No roles found
      
    } catch (err) {
      toast.error(`Error proceeding: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-connect on component mount
  useEffect(() => {
    const checkConnectedWallet = async () => {
      if (window.ethereum?.selectedAddress) {
        const address = window.ethereum.selectedAddress;
        setAddress(address);
        localStorage.setItem('userAddress', address);
      }
    };
    
    checkConnectedWallet();
    window.ethereum?.on('accountsChanged', () => router.refresh());
  }, [router]);

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-3xl font-bold text-center text-black mb-4">AgriTrace Sign In</h1>
      <p className="text-center text-gray-600 mb-6">Connect your wallet to access the supply chain network</p>

      <button
        onClick={connectToMetamask}
        disabled={isLoading}
        className={`bg-blue-600 text-white font-bold py-2 px-4 rounded-lg block w-full mb-4
          ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
      >
        {isLoading ? 'Connecting...' : 'Connect MetaMask'}
      </button>

      {address && (
        <div className="mb-6 text-center">
          <p className="text-gray-700">Connected Address:</p>
          <p className="text-blue-600 font-mono truncate">{address}</p>
        </div>
      )}

      <button
        onClick={handleProceed}
        disabled={!address || isLoading}
        className={`bg-green-600 text-white font-bold py-2 px-4 rounded-lg block w-full mb-4
          ${(!address || isLoading) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'}`}
      >
        {isLoading ? 'Checking Roles...' : 'Proceed to Dashboard'}
      </button>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or continue without registration</span>
        </div>
      </div>

      <button
        onClick={() => router.push('/dashboard/customer')}
        className="w-full p-4 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold
          transform hover:scale-105 transition-all flex items-center justify-center"
      >
        Continue as Customer
      </button>

      <Toaster position="top-center" />
    </div>
  );
};

export default SignIn;