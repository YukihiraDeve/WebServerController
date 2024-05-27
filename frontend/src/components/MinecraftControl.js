import React, { useState } from 'react';
import axios from 'axios';
import 'tailwindcss/tailwind.css';

const MinecraftControl = () => {
  // State pour stocker la clé de l'API
  const [apiKey, setApiKey] = useState('test');

  const startServer = () => {
    axios.post('http://localhost:3001/api/minecraft/start', {}, {
      headers: {
        'x-api-key': apiKey
      }
    })
    .then(response => {
      alert('Server started successfully: ' + response.data.message);
    })
    .catch(error => {
      console.error('Error starting server:', error);
      alert('Error starting server: ' + (error.response?.data?.message || error.message));
    });
  };

  const restartServer = () => {
    axios.post('http://localhost:3001/api/minecraft/restart', {}, {
      headers: {
        'x-api-key': apiKey
      }
    })
    .then(response => {
      alert('Server restarted successfully: ' + response.data.message);
    })
    .catch(error => {
      console.error('Error restarting server:', error);
      alert('Error restarting server: ' + (error.response?.data?.message || error.message));
    });
  };

  const stopServer = () => {
    axios.post('http://localhost:3001/api/minecraft/stop', {}, {
      headers: {
        'x-api-key': apiKey
      }
    })
    .then(response => {
      alert('Server stopped successfully: ' + response.data.message);
    })
    .catch(error => {
      console.error('Error stopping server:', error);
      alert('Error stopping server: ' + (error.response?.data?.message || error.message));
    });
  };

  return (
    <div className="mt-8">
      <div className="mb-4">
        <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700">API Key:</label>
        <input
          type="text"
          id="apiKey"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
            focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          placeholder="Enter your API key"
        />
      </div>

      <button
        onClick={startServer}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Start Minecraft Server
      </button>
      <button
        onClick={restartServer}
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-4"
      >
        Restart Minecraft Server
      </button>
      <button
        onClick={stopServer}
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-4"
      >
        Stop Minecraft Server
      </button>
    </div>
  );
};

export default MinecraftControl;