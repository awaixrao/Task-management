import React from 'react'
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
      <div className="footer bg-gray-800 text-white py-4 text-center">
        <Link to="/terms" className="text-gray-400 hover:text-white">Terms of Service</Link>
        <Link to="/privacy" className="text-gray-400 hover:text-white ml-4">Privacy Policy</Link>
        <p className="mt-2">&copy; 2024 Task Manager. All rights reserved.</p>
      </div>
    );
  };

export default Footer

  