'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import About from './About';
import SignIn from './SignIn';
import CarbonCreditSignIn from './CarbonCreditSignIn';
import Footer from '@/components/Footer';

const App = () => {
  const [activeSection, setActiveSection] = useState('about');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="window max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
        {/* Navigation Bar */}
        <nav className="mb-6">
          <ul className="flex justify-around">
            <li>
              <button
                onClick={() => setActiveSection('about')}
                className={`text-lg font-semibold transition duration-300 ${activeSection === 'about' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
              >
                About
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveSection('signIn')}
                className={`text-lg font-semibold transition duration-300 ${activeSection === 'signIn' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
              >
                AgriTrace
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveSection('carbonCredit')}
                className={`text-lg font-semibold transition duration-300 ${activeSection === 'carbonCredit' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-600 hover:text-green-600'}`}
              >
                CarbonCreditNFT
              </button>
            </li>
          </ul>
        </nav>

        {/* Animated Content */}
        <AnimatePresence mode="wait">
          {activeSection === 'about' ? (
            <motion.div
              key="About"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <About />
            </motion.div>
          ) : activeSection === 'signIn' ? (
            <motion.div
              key="signIn"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <SignIn />
            </motion.div>
          ) : (
            <motion.div
              key="carbonCredit"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <CarbonCreditSignIn />
              
              {/* Marketplace Link */}
              <div className="mt-6 text-center">
                <a 
                  href="/carbon-credit/marketplace" 
                  className="inline-block bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition duration-300"
                >
                  Browse Carbon Credit Marketplace
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <Footer />
    </div>
  );
};

export default App;
