
const CONFIG = {
    RPC_URLS: {
      DAAVEE: 'http://localhost:8550',
      IITBH: 'http://10.10.2.157:8550'
    },
    NODE_EXPORTERS: {
      NODE1: 'http://localhost:9100/metrics',
      NODE2: 'http://10.10.2.157:9100/metrics'
    },
    CHAIN_DATA_URL: 'http://localhost:3000/getChainData',
    PROCESSED_DATA_URL: 'http://127.0.0.1:5000/processed_data'
  };

  
  
  export const RPC_URLS = CONFIG.RPC_URLS;
  export const NODE_EXPORTERS = CONFIG.NODE_EXPORTERS;
  export const CHAIN_DATA_URL = CONFIG.CHAIN_DATA_URL;
  export const PROCESSED_DATA_URL = CONFIG.PROCESSED_DATA_URL;