import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ServerList = () => {
  const [servers, setServers] = useState([]);
  const [serverName, setServerName] = useState('');
  const [apiKey, setApiKey] = useState('test');
  const navigate = useNavigate();

  useEffect(() => {
    fetchServers();
  }, []);

  const fetchServers = () => {
    axios.get(`http://90.79.8.144:3001/api/minecraft/list`, {
      headers: { 'x-api-key': apiKey }
    })
    .then(response => setServers(response.data))
    .catch(error => console.error('Error fetching servers:', error));
  };

  const handleCreateServer = () => {
    axios.post(`http://90.79.8.144:3001/api/minecraft/create`, { serverName }, {
      headers: { 'x-api-key': apiKey }
    })
    .then(response => {
      alert('Server created successfully: ' + response.data.message);
      fetchServers(); // Actualiser la liste des serveurs
    })
    .catch(error => {
      console.error('Error creating server:', error);
      alert('Error creating server: ' + (error.response?.data?.message || error.message));
    });
  };

  const handleServerClick = (serverName) => {
    navigate(`/server/${serverName}`);
  };

  return (
    <div className="flex flex-col items-center p-6 z-10">
      <h1 className="text-2xl font-bold mb-4 z-10">Minecraft Servers</h1>
      <div className="mb-6 z-10">
        <input
          type="text"
          placeholder="Server Name"
          value={serverName}
          onChange={(e) => setServerName(e.target.value)}
          className="mr-2 px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
              focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 z-10"
        />
        <button
          onClick={handleCreateServer}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded z-10"
        >
          Create Server
        </button>
      </div>
      <ul className="w-full z-10">
        {servers.map(server => (
          <li key={server} className="p-4 bg-white shadow rounded-lg mb-4 cursor-pointer z-10" onClick={() => handleServerClick(server)}>
            {server}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ServerList;
