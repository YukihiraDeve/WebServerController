import React, { useEffect, useState } from 'react';

const ServerStatus = ({ serverName }) => {
  const [stats, setStats] = useState({ memory: {}, cpu: [], storage: '' });

  const fetchStats = () => {
    fetch(`http://localhost:3001/api/system-stats/stats/${serverName}`, {
      headers: { 'x-api-key': 'test' }
    })
      .then(response => response.json())
      .then(data => setStats(data))
      .catch(error => console.error('Error fetching system stats:', error));
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

  return (
    <div className="drop-shadow-xl grid gap-6 md:grid-cols-3 p-4 md:p-8 max-w-5xl mx-auto w-full">
      {/* Memory Stats */}
      <div className="p-6 bg-white shadow rounded-2xl dark:bg-gray-900 flex flex-col justify-center h-48 overflow-hidden">
        <dl className="space-y-2">
          <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Memory Usage</dt>
          <dd className="text-5xl font-light md:text-6xl dark:text-white">{usedMemoryPercent}%</dd>
          <dd className="flex items-center space-x-1 text-sm font-medium text-green-500 dark:text-green-400"></dd>
        </dl>
      </div>

      {/* CPU Stats */}
      <div className="drop-shadow-xl p-6 bg-white shadow rounded-2xl dark:bg-gray-900 flex flex-col justify-center h-48 overflow-hidden">
        <dl className="space-y-2">
          <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">CPU Usage</dt>
          <dd className="text-5xl font-light md:text-6xl dark:text-white">{(stats.cpu.reduce((total, cpu) => total + cpu.usage, 0) * stats.cpu.length || 0).toFixed(2)}%</dd>
        </dl>
      </div>

      {/* Storage Stats */}
      <div className="drop-shadow-xl p-6 bg-white shadow rounded-2xl dark:bg-gray-900 flex flex-col justify-center h-48 overflow-hidden">
        <dl className="space-y-2">
          <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Storage Free</dt>
          <dd className="text-5xl font-light md:text-6xl dark:text-white">{storageFreePercent}%</dd>
        </dl>
      </div>
    </div>
  );
};

export default ServerStatus;
