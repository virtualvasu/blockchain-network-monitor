import express from 'express';
import Web3 from 'web3';
const app = express();
const web3 = new Web3('http://localhost:8550');
// import axios from 'axios';

async function fetchSystemMetrics() {
  try {
    const response = await fetch('http://localhost:9100/metrics'); // Node Exporter endpoint
    const text = await response.text();

    // RAM parsing
    const memTotalMatch = text.match(/node_memory_MemTotal_bytes\s+([0-9.e+-]+)/);
    const memAvailableMatch = text.match(/node_memory_MemAvailable_bytes\s+([0-9.e+-]+)/);

    let memTotal = 0;
    let memAvailable = 0;

    if (memTotalMatch) {
      memTotal = parseFloat(memTotalMatch[1]);
    }

    if (memAvailableMatch) {
      memAvailable = parseFloat(memAvailableMatch[1]);
    }

    const memUsed = memTotal - memAvailable;

    const memTotalMB = memTotal / (1024 * 1024);
    const memAvailableMB = memAvailable / (1024 * 1024);
    const memUsedMB = memUsed / (1024 * 1024);

    // CPU parsing
    const cpuUserMatches = [...text.matchAll(/node_cpu_seconds_total\{.*mode="user".*\}\s+([0-9.e+-]+)/g)];
    const cpuSystemMatches = [...text.matchAll(/node_cpu_seconds_total\{.*mode="system".*\}\s+([0-9.e+-]+)/g)];

    let cpuUserSeconds = 0;
    let cpuSystemSeconds = 0;

    cpuUserMatches.forEach(match => {
      cpuUserSeconds += parseFloat(match[1]);
    });

    cpuSystemMatches.forEach(match => {
      cpuSystemSeconds += parseFloat(match[1]);
    });

    // Network parsing
    const networkReceiveMatches = [...text.matchAll(/node_network_receive_bytes_total\{.*device="([^"]+)".*\}\s+([0-9.e+-]+)/g)];
    const networkTransmitMatches = [...text.matchAll(/node_network_transmit_bytes_total\{.*device="([^"]+)".*\}\s+([0-9.e+-]+)/g)];

    let networkReceivedBytes = 0;
    let networkTransmittedBytes = 0;

    networkReceiveMatches.forEach(match => {
      const device = match[1];
      const value = parseFloat(match[2]);
      if (!device.startsWith('lo') && !device.startsWith('docker')) { // Ignore loopback and docker devices
        networkReceivedBytes += value;
      }
    });

    networkTransmitMatches.forEach(match => {
      const device = match[1];
      const value = parseFloat(match[2]);
      if (!device.startsWith('lo') && !device.startsWith('docker')) { // Ignore loopback and docker devices
        networkTransmittedBytes += value;
      }
    });

    const networkReceivedMB = networkReceivedBytes / (1024 * 1024);
    const networkTransmittedMB = networkTransmittedBytes / (1024 * 1024);

    // Load Average parsing
    const load1Match = text.match(/node_load1\s+([0-9.e+-]+)/);
    const load5Match = text.match(/node_load5\s+([0-9.e+-]+)/);
    const load15Match = text.match(/node_load15\s+([0-9.e+-]+)/);

    const load1 = load1Match ? parseFloat(load1Match[1]) : 0;
    const load5 = load5Match ? parseFloat(load5Match[1]) : 0;
    const load15 = load15Match ? parseFloat(load15Match[1]) : 0;

    // Final JSON object
    const systemMetrics = {
      total_ram: memTotalMB.toFixed(2),
      ram_available: memAvailableMB.toFixed(2),
      ram_used: memUsedMB.toFixed(2),
      cpu_user_secs: cpuUserSeconds.toFixed(2),
      cpu_system_secs: cpuSystemSeconds.toFixed(2),
      network_received: networkReceivedMB.toFixed(2),
      network_transmitted: networkTransmittedMB.toFixed(2),
      system_load_avg_one_min: load1.toFixed(2),
      system_load_avg_five_min: load5.toFixed(2),
      system_load_avg_fifteen_min: load15.toFixed(2)
    };

    return systemMetrics;

  } catch (error) {
    console.error('Error fetching system metrics:', error);
    return null;
  }
}


app.get('/getChainData', async (req, res) => {
  try {
    const latestBlockData = await web3.eth.getBlock('latest');
    const chainID = await web3.eth.getChainId();
    const pendingTransactions = await web3.eth.getBlock('pending', true);

    const peerCount = await web3.eth.net.getPeerCount();

    const data = {
      latestBlockData: {
        blockNumber: parseInt(latestBlockData.number),
        gasUsed: parseInt(latestBlockData.gasUsed),
        totalDifficulty: BigInt(latestBlockData.totalDifficulty).toString(), // Keeping it as a string to prevent JS number overflow
        timestamp: parseInt(latestBlockData.timestamp),
        transactions: latestBlockData.transactions,
        transactionsCount: latestBlockData.transactions.length,
        orphanedBlocks: latestBlockData.uncles.length,
        gasLimit: parseInt(latestBlockData.gasLimit),
        blockSize: parseInt(latestBlockData.size),
      },
      networkData: {
        peerCount: parseInt(peerCount),
        chainId: parseInt(chainID),
        pendingTransactions: parseInt(pendingTransactions.transactions.length)
      },
      oslogs: await fetchSystemMetrics()
    };


    console.log('Block Data:', data); // ✅ Logs data to console

    res.json(data); // ✅ Sends JSON response with proper types
  } catch (err) {
    console.error('Error fetching block data:', err);
    res.status(500).send('Error fetching data');
  }
});



app.listen(3000, () => console.log('Server running on port 3000'));
