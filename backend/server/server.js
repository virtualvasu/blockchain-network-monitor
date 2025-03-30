import express from 'express';
import Web3 from 'web3';

const app = express();
const web3 = new Web3('http://10.10.2.157:8080');
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
      }
    };


    console.log('Block Data:', data); // ✅ Logs data to console

    res.json(data); // ✅ Sends JSON response with proper types
  } catch (err) {
    console.error('Error fetching block data:', err);
    res.status(500).send('Error fetching data');
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));
