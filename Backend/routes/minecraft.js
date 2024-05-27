const express = require('express');
const router = express.Router();
const shell = require('shelljs');

router.post('/start', (req, res) => {
  shell.exec('itsjustatest', (code, stdout, stderr) => {
    if (code) {
      res.status(500).send({ message: 'Failed to start the Minecraft server', error: stderr });
    } else {
      res.send({ message: 'Minecraft server started successfully', output: stdout });
    }
  });
});

router.post('/restart', (req, res) => {
    shell.exec('itsjustatest', (code, stdout, stderr) => {
      if (code) {
        res.status(500).send({ message: 'Failed to restart the Minecraft server', error: stderr });
      } else {
        res.send({ message: 'Minecraft server has restarted successfully', output: stdout });
      }
    });
  });

  router.post('/shutdown', (req, res) => {
    shell.exec('itsjustatest', (code, stdout, stderr) => {
      if (code) {
        res.status(500).send({ message: 'Failed to shutdown the Minecraft server', error: stderr });
      } else {
        res.send({ message: 'Minecraft server is shutdown successfully', output: stdout });
      }
    });
  });

module.exports = router;