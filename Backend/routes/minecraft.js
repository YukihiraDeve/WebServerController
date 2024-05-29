const express = require('express');
const router = express.Router();
const shell = require('shelljs');
const path = require('path'); 

const fs = require('fs');
const archiver = require('archiver');

let servers = ["test"];

router.post('/start/:serverName', (req, res) => {
  const { serverName } = req.params;
  shell.exec(`./scripts/startServer.sh ${serverName}`, (code, stdout, stderr) => {
    if (code) {
      res.status(500).send({ message: 'Failed to start the Minecraft server', error: stderr });
    } else {
      res.send({ message: 'Minecraft server started successfully', output: stdout });
    }
  });
});

router.post('/restart/:serverName', (req, res) => {
  const { serverName } = req.params;
  shell.exec(`./scripts/restartServer.sh ${serverName}`, (code, stdout, stderr) => {
    if (code) {
      res.status(500).send({ message: 'Failed to restart the Minecraft server', error: stderr });
    } else {
      res.send({ message: 'Minecraft server has restarted successfully', output: stdout });
    }
  });
});

router.post('/shutdown/:serverName', (req, res) => {
  const { serverName } = req.params;
  shell.exec(`./scripts/shutdownServer.sh ${serverName}`, (code, stdout, stderr) => {
    if (code) {
      res.status(500).send({ message: 'Failed to shutdown the Minecraft server', error: stderr });
    } else {
      res.send({ message: 'Minecraft server is shutdown successfully', output: stdout });
    }
  });
});

router.post('/create', (req, res) => {
  const { serverName } = req.body;
  shell.exec(`./scripts/createServer.sh ${serverName}`, (code, stdout, stderr) => {
    if (code) {
      res.status(500).send({ message: 'Failed to create the Minecraft server', error: stderr });
    } else {
      servers.push(serverName);
      res.send({ message: `Minecraft server is created successfully with ${serverName}`, output: stdout });
    }
  });
});

const validNameRegex = /^[a-zA-Z0-9_-]+$/;

router.post('/export/:serverName/:worldName?', (req, res) => {
  const { serverName, worldName = 'world' } = req.params;
  
  if (!validNameRegex.test(serverName) || !validNameRegex.test(worldName)) {
    return res.status(400).send({ message: 'Invalid serverName or worldName provided.' });
  }

  const outputDir = `/servers/${serverName}/exports`;
  const objFilePath = path.join(outputDir, `${worldName}.obj`);
  const mtlFilePath = path.join(outputDir, `${worldName}.mtl`);

  shell.exec(`./scripts/exportMap.sh ${serverName} ${worldName}`, (code, stdout, stderr) => {
    if (code) {
      res.status(500).send({ message: 'Failed to export the Minecraft world', error: stderr });
    } else {
      if (!fs.existsSync(objFilePath) || !fs.existsSync(mtlFilePath)) {
        return res.status(404).send({ message: 'Exported files not found.' });
      }

      res.json({
        objFile: `/servers/${serverName}/${worldName}.obj`,
        mtlFile: `/servers/${serverName}/${worldName}.mtl`
      });
    }
  });
});


router.get('/list', (req, res) => {
    shell.exec('./scripts/listServer.sh', (code, stdout, stderr) => {
      if (code) {
        res.status(500).send({ message: 'Failed to list Minecraft servers', error: stderr });
      } else {
        const serverList = stdout.split('\n').filter(line => line.trim() !== '');
        res.json(serverList);
      }
    });
  });


  router.get('/status/:serverName', (req, res) => {
    const { serverName } = req.params;
    shell.exec(`./scripts/checkServerStatus.sh ${serverName}`, (code, stdout, stderr) => {
      if (code) {
        res.send({ status: 'off', message: stdout });
      } else {
        res.send({ status: 'on', message: stdout });
      }
    });
  });

  
  router.use('/files', express.static('/servers'));

module.exports = router;
