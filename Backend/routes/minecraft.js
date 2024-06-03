const express = require('express');
const router = express.Router();
const shell = require('shelljs');
const path = require('path'); 

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

router.post('/export/:serverName/:worldName?', (req, res) => {
    const { serverName, worldName = 'world' } = req.params;
    const outputDir = `../export/${serverName}`;
    shell.exec(`./scripts/exportMap.sh ${serverName} ${worldName}`, (code, stdout, stderr) => {
      if (code) {
        res.status(500).send({ message: 'Failed to export the Minecraft world', error: stderr });
      } else {
        shell.exec(`./scripts/mooveMap.sh ${serverName} ${worldName}`, (code, stdout, stderr) => {
            const outputDir = `/servers/${serverName}/exports`;
            const filePath = path.join(outputDir, `${worldName}.obj`);
            res.download(filePath, `${worldName}.obj`, (err) => {
            if (err) {
                console.error('Error sending file:', err);
                res.status(500).send({ message: 'Error sending file', error: err });
                }
            });            
        });
    }})
  });

  



  router.post('/exportMTL/:serverName/:worldName?', (req, res) => {
    const { serverName, worldName = 'world' } = req.params;
    const outputDir = `/servers/${serverName}/exports`;
    const filePath = path.join(outputDir, `${worldName}.mtl`);
    res.download(filePath, `${worldName}.mtl`, (err) => {
      if (err) {
          console.error('Error sending file:', err);
          res.status(500).send({ message: 'Error sending file', error: err });
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

  router.get('/players/:serverName', (req, res) => {
    const { serverName } = req.params;
    const screenCommand = `screen -S ${serverName} -p 0 -X stuff "list^M"`;
    const logFile = `/servers/${serverName}/server.log`;
  
    console.log(`Executing command: ${screenCommand}`);
    
    shell.exec(screenCommand, { silent: true }, (code, stdout, stderr) => {
      if (code) {
        console.error(`Error executing screen command: ${stderr}`);
        return res.status(500).send({ message: 'Failed to execute screen command', error: stderr });
      }
  
      setTimeout(() => {
        shell.exec(`tail -n 20 ${logFile}`, (code, stdout, stderr) => {
          if (code) {
            console.error(`Error reading log file: ${stderr}`);
            return res.status(500).send({ message: 'Failed to read log file', error: stderr });
          }
  
          const match = stdout.match(/There are (\d+) of a max of \d+ players online/);
          if (match) {
            res.send({ playerCount: parseInt(match[1], 10) });
          } else {
            res.send({ playerCount: 0 });
          }
        });
      }, 1000);
    });
  });
  
  

  


module.exports = router;