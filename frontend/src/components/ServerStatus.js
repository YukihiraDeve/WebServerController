import React, { useEffect, useState } from 'react';

const ServerStatus = ({ serverName, section }) => {
  const [stats, setStats] = useState({ memory: {}, cpu: [], storage: '', players: 0 });

  const fetchStats = () => {
    fetch(`http://90.79.8.144:3001/api/system-stats/stats/${serverName}`, {
      headers: { 'x-api-key': 'test' }
    })
      .then(response => response.json())
      .then(data => setStats(prevStats => ({ ...prevStats, ...data })))
      .catch(error => console.error('Error fetching system stats:', error));
    
    fetch(`http://90.79.8.144:3001/api/minecraft/players/${serverName}`, {
      headers: { 'x-api-key': 'test' }
    })
      .then(response => response.json())
      .then(data => setStats(prevStats => ({ ...prevStats, players: data.playerCount })))
      .catch(error => console.error('Error fetching player count:', error));
  };

  useEffect(() => {
    fetchStats();

    const intervalId = setInterval(fetchStats, 10000);

    return () => clearInterval(intervalId);
  }, [serverName]);

  const totalMemory = stats.memory.total || 1;
  const usedMemoryPercent = ((stats.memory.used / totalMemory) * 100).toFixed(2);
  const freeMemoryPercent = ((stats.memory.free / totalMemory) * 100).toFixed(2);

  const extractStorageFreePercentage = (storageString) => {
    try {
      const lines = storageString.split('\n');
      const relevantLine = lines.find(line => line.startsWith('/dev'));
      if (relevantLine) {
        const columns = relevantLine.trim().split(/\s+/);
        const capacity = columns[4];
        return (100 - parseInt(capacity.replace('%', ''), 10)).toFixed(2);
      }
      return 'N/A';
    } catch (error) {
      console.error('Error parsing storage data:', error);
      return 'N/A';
    }
  };

  const storageFreePercent = extractStorageFreePercentage(stats.storage);

  const renderSection = () => {
    switch(section) {
      case 'memory':
        return (
          <div className="drop-shadow-xl p-6 bg-white shadow rounded-2xl dark:bg-gray-900 dark:bg-opacity-50 flex flex-col justify-center h-48 overflow-hidden z-20">
            <dl className="space-y-2 z-20">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 z-20">Memory Usage</dt>
              <dd className="text-5xl font-light md:text-6xl dark:text-white z-20">{usedMemoryPercent}%</dd>
            </dl>
          </div>
        );
      case 'cpu':
        return (
          <div className="drop-shadow-xl p-6 bg-white shadow rounded-2xl dark:bg-gray-900 dark:bg-opacity-50 flex flex-col justify-center h-48 overflow-hidden z-20">
            <dl className="space-y-2">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">CPU Usage</dt>
              <dd className="text-5xl font-light md:text-6xl dark:text-white">{(stats.cpu.reduce((total, cpu) => total + cpu.usage, 0) * stats.cpu.length || 0).toFixed(2)}%</dd>
            </dl>
          </div>
        );
      case 'storage':
        return (
          <div className="drop-shadow-xl p-6 bg-white shadow rounded-2xl dark:bg-gray-900 dark:bg-opacity-50 flex flex-col justify-center h-48 overflow-hidden">
            <dl className="space-y-2">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Storage Free</dt>
              <dd className="text-5xl font-light md:text-6xl dark:text-white">{storageFreePercent}%</dd>
            </dl>
          </div>
        );
      case 'players':
        return (
          <div className="drop-shadow-xl p-6 bg-white shadow rounded-2xl dark:bg-gray-900 dark:bg-opacity-50 flex flex-col justify-center h-48 overflow-hidden">
            <dl className="space-y-2">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Players Online</dt>
              <dd className="text-5xl font-light md:text-6xl dark:text-white">{stats.players}</dd>
            </dl>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      {renderSection()}
    </div>
  );
};

export default ServerStatus;
