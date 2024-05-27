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
    <div className="drop-shadow-xl relative p-6 bg-white shadow rounded-2xl dark:bg-gray-900 flex flex-col space-y-2 mr-10 mt-10">
      <div className="absolute inset-0 bg-white dark:bg-gray-900 opacity-50 rounded-2xl"></div>
      <button
        onClick={startServer}
        className="relative bg-blue-500 text-white font-bold py-2 px-4 rounded transition duration-700 ease-in-out hover:bg-blue-700"
      >
        Start Minecraft Server
      </button>
      <button
        onClick={restartServer}
        className="relative bg-green-500 text-white font-bold py-2 px-4 rounded transition duration-700 ease-in-out hover:bg-green-700"
      >
        Restart Minecraft Server
      </button>
      <button
        onClick={stopServer}
        className="relative bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-700 ease-in-out"
      >
        Stop Minecraft Server
      </button>
    </div>
  );
};

export default MinecraftControl;