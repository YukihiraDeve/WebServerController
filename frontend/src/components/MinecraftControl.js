// MinecraftControl.js
import React, { useState } from 'react';
import axios from 'axios';
import 'tailwindcss/tailwind.css';
import '../App.css';

const MinecraftControl = () => {
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
    <div className="bg-red-200 bg-opacity-50 rounded-lg p-4 flex flex-col space-y-4 mr-10 mt-10">
      <button
        onClick={startServer}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Start Minecraft Server
      </button>
      <button
        onClick={restartServer}
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
      >
        Restart Minecraft Server
      </button>
      <button
        onClick={stopServer}
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
      >
        Stop Minecraft Server
      </button>
    </div>
  );
};

export default MinecraftControl;
