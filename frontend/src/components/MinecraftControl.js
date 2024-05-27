import React, { useState } from 'react';
import axios from 'axios';
import 'tailwindcss/tailwind.css';
import '../App.css';



const MinecraftControl = ({ serverName }) => {
  const [apiKey, setApiKey] = useState('test');

  const startServer = () => {
    axios.post(`http://172.16.173.137:3001/api/minecraft/start/${serverName}`, {}, {
      headers: { 'x-api-key': apiKey }
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
    axios.post(`http://172.16.173.137:3001/api/minecraft/restart/${serverName}`, {}, {
      headers: { 'x-api-key': apiKey }
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
    axios.post(`http://172.16.173.137:3001/api/minecraft/shutdown/${serverName}`, {}, {
      headers: { 'x-api-key': apiKey }
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
    <div className="drop-shadow-xl relative p-6 bg-white shadow rounded-2xl dark:bg-gray-900 flex flex-col space-y-4 mr-10 mt-10">
      <div className="absolute inset-0 bg-white dark:bg-gray-900 opacity-50 rounded-2xl"></div>
      <button
        onClick={startServer}
        className="relative text-white font-bold py-2 px-4 rounded transition-all duration-700 ease-in-out bg-[length:200%_200%] bg-gradient-to-r from-blue-400 to-blue-200 hover:from-blue-500 hover:to-green-400"
      >
        Start Minecraft Server
      </button>
      <button
        onClick={restartServer}
        className="relative text-white font-bold py-2 px-4 rounded transition-all duration-700 ease-in-out bg-[length:200%_200%] bg-gradient-to-r from-green-500 to-teal-500 hover:from-teal-500 hover:to-green-500"
      >
        Restart Minecraft Server
      </button>
      <button
        onClick={stopServer}
        className="relative text-white font-bold py-2 px-4 rounded transition-all duration-700 ease-in-out bg-[length:200%_200%] bg-gradient-to-r from-red-500 to-pink-500 hover:from-pink-500 hover:to-red-500"
      >
        Stop Minecraft Server
      </button>
    </div>
  );
};

export default MinecraftControl;
