'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ethers } from 'ethers';
import toast, { Toaster } from 'react-hot-toast';
import { contractADDRESS, contractAbi } from '@/Utils/config';

const RoleSelection = () => {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
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

      return {
        farmer: isFarmer,
        transporter: isTransporter,
        warehouse: isWarehouse,
        retailer: isRetailer
      };
    } catch (err) {
      toast.error(`Error checking roles: ${err.message}`);
      return null;
    }
  };

  const handleRoleSelection = async (selectedRole) => {
    if (selectedRole === 'customer') {
      router.push('/dashboard/customer');
      return;
    }

    setLoading(true);
    try {
      const userAddress = localStorage.getItem('userAddress');
      if (!userAddress) {
        toast.error('No connected wallet found');
        return;
      }

      // Always check current roles directly from contract
      const currentRoles = await checkRoles(userAddress);
      if (!currentRoles) return;

      // Check if already registered in selected role
      if (currentRoles[selectedRole]) {
        router.push(`/dashboard/${selectedRole}`);
        return;
      }

      // Check if registered in any other role
      const existingRole = Object.entries(currentRoles).find(([role, registered]) => 
        role !== selectedRole && registered
      );

      if (existingRole) {
        toast.error(`You are already registered as ${existingRole[0]}`);
        router.push(`/dashboard/${existingRole[0]}`);
        return;
      }

      // Proceed with registration if no existing role
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractADDRESS, contractAbi, signer);

      const methodName = `registerAs${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}`;
      const tx = await contract[methodName]();
      await tx.wait();

      // Redirect after successful registration
      router.push(`/dashboard/${selectedRole}`);
      toast.success(`Successfully registered as ${selectedRole}!`);
    } catch (err) {
      if (err.message.includes("Already registered in another role")) {
        // If contract throws this error, find actual role and redirect
        const userAddress = localStorage.getItem('userAddress');
        const currentRoles = await checkRoles(userAddress);
        const actualRole = Object.entries(currentRoles).find(([_, val]) => val)?.[0];
        if (actualRole) {
          router.push(`/dashboard/${actualRole}`);
        }
      } else {
        toast.error(`Registration failed: ${err.reason || err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Remove the useEffect that auto-redirects on mount
  // Keep only the role selection handler with fresh checks

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-2xl p-8">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-2">Select Role</h1>
        <p className="text-center text-gray-600 mb-8">Choose your role in the supply chain network</p>
        
        <div className="space-y-4">
          {['farmer', 'transporter', 'warehouse', 'retailer'].map((role) => (
            <button
              key={role}
              onClick={() => handleRoleSelection(role)}
              disabled={loading}
              className={`w-full p-4 rounded-lg text-white font-bold transition-all transform hover:scale-105
                bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed
                flex items-center justify-center space-x-2`}
            >
              <span>{`Register as ${role.charAt(0).toUpperCase() + role.slice(1)}`}</span>
              {loading && <div className="animate-spin h-5 w-5 border-2 border-white rounded-full border-t-transparent"></div>}
            </button>
          ))}

          <button
            onClick={() => handleRoleSelection('customer')}
            className="w-full p-4 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold
              transform hover:scale-105 transition-all flex items-center justify-center"
          >
            Continue as Customer
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Already have an account?</span>
            </div>
          </div>

          <button
            onClick={() => router.push('/')}
            className="w-full p-4 rounded-lg bg-gray-800 hover:bg-gray-900 text-white font-bold
              transform hover:scale-105 transition-all flex items-center justify-center"
          >
            Sign In
          </button>
        </div>
        <Toaster position="top-center" />
      </div>
    </div>
  );
};

export default RoleSelection;