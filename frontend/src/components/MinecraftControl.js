import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'tailwindcss/tailwind.css';
import '../App.css';

const MinecraftControl = ({ serverName }) => {
  const [apiKey, setApiKey] = useState('test');
  const [serverStatus, setServerStatus] = useState('off'); // 'off' or 'on'
  const [loading, setLoading] = useState(false); // État de chargement

  useEffect(() => {
    checkServerStatus();
  }, []);

  const checkServerStatus = () => {
    setLoading(true);
    axios.get(`http://90.79.8.144:3001/api/minecraft/status/${serverName}`, {
      headers: { 'x-api-key': apiKey }
    })
    .then(response => {
      setServerStatus(response.data.status);
    })
    .catch(error => {
      console.error('Error checking server status:', error);
      alert('Error checking server status: ' + (error.response?.data?.message || error.message));
    })
    .finally(() => {
      setLoading(false);
    });
  };

  const startServer = () => {
    setLoading(true);
    axios.post(`http://90.79.8.144:3001/api/minecraft/start/${serverName}`, {}, {
      headers: { 'x-api-key': apiKey }
    })
    .then(response => {
      alert('Server started successfully: ' + response.data.message);
      setServerStatus('on'); // Update state to 'on'
    })
    .catch(error => {
      console.error('Error starting server:', error);
      alert('Error starting server: ' + (error.response?.data?.message || error.message));
    })
    .finally(() => {
      setLoading(false);
    });
  };

  const restartServer = () => {
    setLoading(true);
    axios.post(`http://90.79.8.144:3001/api/minecraft/restart/${serverName}`, {}, {
      headers: { 'x-api-key': apiKey }
    })
    .then(response => {
      alert('Server restarted successfully: ' + response.data.message);
      setServerStatus('on'); // Keep state 'on' as server is restarted not stopped
    })
    .catch(error => {
      console.error('Error restarting server:', error);
      alert('Error restarting server: ' + (error.response?.data?.message || error.message));
    })
    .finally(() => {
      setLoading(false);
    });
  };

  const stopServer = () => {
    setLoading(true);
    axios.post(`http://90.79.8.144:3001/api/minecraft/shutdown/${serverName}`, {}, {
      headers: { 'x-api-key': apiKey }
    })
    .then(response => {
      alert('Server stopped successfully: ' + response.data.message);
      setServerStatus('off'); // Update state to 'off'
    })
    .catch(error => {
      console.error('Error stopping server:', error);
      alert('Error stopping server: ' + (error.response?.data?.message || error.message));
    })
    .finally(() => {
      setLoading(false);
    });
  };

  return (
    <div className="drop-shadow-xl p-6 bg-white shadow rounded-2xl dark:bg-gray-900 flex flex-col justify-between h-48 overflow-hidden">
      <div className="flex flex-col justify-center items-center space-y-4 h-full">
        {serverStatus === 'off' ? (
          <button
            onClick={startServer}
            className="relative w-full text-white font-bold py-4 px-6 rounded transition-all duration-700 ease-in-out bg-[length:200%_200%] bg-gradient-to-r from-blue-400 to-blue-200 hover:from-blue-500 hover:to-green-400"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291l1.42-1.42A5.962 5.962 0 016 12H2c0 2.28.965 4.373 2.54 5.76L6 17.29z"></path>
                </svg>
                Loading...
              </div>
            ) : (
              'Start Server'
            )}
          </button>
        ) : (
          <>
            <button
              onClick={restartServer}
              className="relative w-full text-white font-bold py-4 px-6 rounded transition-all duration-700 ease-in-out bg-[length:200%_200%] bg-gradient-to-r from-green-500 to-teal-500 hover:from-teal-500 hover:to-green-500"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291l1.42-1.42A5.962 5.962 0 016 12H2c0 2.28.965 4.373 2.54 5.76L6 17.29z"></path>
                  </svg>
                  Loading...
                </div>
              ) : (
                'Restart Server'
              )}
            </button>
            <button
              onClick={stopServer}
              className="relative w-full text-white font-bold py-4 px-6 rounded transition-all duration-700 ease-in-out bg-[length:200%_200%] bg-gradient-to-r from-red-500 to-pink-500 hover:from-pink-500 hover:to-red-500"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291l1.42-1.42A5.962 5.962 0 016 12H2c0 2.28.965 4.373 2.54 5.76L6 17.29z"></path>
                </svg>
                Loading...
              </div>
            ) : (
              'Stop Server'
            )}
          </button>
          </>
        )}
      </div>
    </div>
  );
};

export default MinecraftControl;
