const express = require('express');
const router = express.Router();
const shell = require('shelljs');
const os = require('os');

router.get('/stats/:serverName', (req, res) => {
  const { serverName } = req.params;

  const totalMemory = os.totalmem();
  const freeMemory = os.freemem();
  const usedMemory = totalMemory - freeMemory;

  const cpus = os.cpus();
  const cpuUsage = cpus.map(cpu => {
    const times = cpu.times;
    const total = times.user + times.nice + times.sys + times.idle + times.irq;
    return {
      model: cpu.model,
      speed: cpu.speed,
      usage: 1 - (times.idle / total)
    };
  });

  const diskUsage = shell.exec(`df -h /path/to/${serverName}`, { silent: true }).stdout;

  res.json({
    memory: {
      total: totalMemory,
      used: usedMemory,
      free: freeMemory
    },
    cpu: cpuUsage,
    storage: diskUsage
  });
});

module.exports = router;
