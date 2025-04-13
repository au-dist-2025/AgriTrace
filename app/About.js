// app/About.js
import React from 'react';

const About = ({ toggleLayout }) => {
  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-center text-black mb-3">Agri Food Supplychain Tracker</h1>
      
      <p className="text-sm text-gray-600 mb-4">
        A blockchain-based dApp for agricultural supply chain traceability. Farmers, transporters, warehouses, and retailers can securely record and verify product information at each stage.
      </p>
      
      <h2 className="text-xl font-bold text-center text-black mb-2">Features</h2>
      <ul className="text-sm text-gray-600 mb-4 space-y-1">
        <li>• NFT-based product tracking</li>
        <li>• Multi-stakeholder dashboards</li>
        <li>• Detailed traceability data</li>
        <li>• IPFS storage via Pinata</li>
        <li>• Complete supply chain history</li>
      </ul>
    </div>
  );
};

export default About;
