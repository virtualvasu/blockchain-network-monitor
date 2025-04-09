import aiohttp 
import asyncio
import json
from collections import deque
import time

# Fetch data from Node backend (non-blocking)
async def fetch_data():
    async with aiohttp.ClientSession() as session:
        try:
            async with session.get("http://localhost:3000/getChainData") as response:
                return await response.json()
        except Exception as e:
            print(f"Error fetching data: {e}")
            return None

# Track previous data and cache for historical graphing
previous_block_time = None
previous_transactions = 0
cumulative_gas_used = 0
max_block_size = 30000000  
data_cache = deque(maxlen=100)  # Store the last 100 processed entries
block_times = deque(maxlen=10)  # For tracking average block time over last 10 blocks

# Enhanced data processing function with organized sections
async def process_data(raw_data):
    global previous_block_time, previous_transactions, cumulative_gas_used, data_cache, block_times

    if not raw_data:
        return {"error": "No data received"}

    latest_block = raw_data.get("latestBlockData", {})
    network_data = raw_data.get("networkData", {})
    oslogs = raw_data.get("oslogs",{})

    # Extract basic data for processing later
    block_number = int(latest_block.get("blockNumber", 0))
    gas_used = int(latest_block.get("gasUsed", 0))
    gas_limit = int(latest_block.get("gasLimit", 1))
    timestamp = int(latest_block.get("timestamp", 0))
    peer_count = int(network_data.get("peerCount", 0))
    transactions_count = int(latest_block.get("transactionsCount", 0))
    pending_txns = int(network_data.get("pendingTransactions", 0))
    total_difficulty = int(latest_block.get("totalDifficulty", 0))
    block_size = int(latest_block.get("blockSize", 0))
    chain_id = int(network_data.get("chainId", 0))
    orphaned_blocks = int(latest_block.get("orphanedBlocks", 0))
    
    #os logs basic data
    
    total_ram = float(oslogs.get("total_ram", 0))
    ram_available = float(oslogs.get("ram_available", 0))
    ram_used = float(oslogs.get("ram_used", 0))
    cpu_user_secs = float(oslogs.get("cpu_user_secs", 0))
    cpu_system_secs = float(oslogs.get("cpu_system_secs", 0))
    network_received = float(oslogs.get("network_received", 0))
    network_transmitted = float(oslogs.get("network_transmitted", 0))
    system_load_avg_one_min = float(oslogs.get("system_load_avg_one_min", 0))
    system_load_avg_five_min = float(oslogs.get("system_load_avg_five_min", 0))
    system_load_avg_fifteen_min = float(oslogs.get("system_load_avg_fifteen_min", 0))
    

    # Calculate derived metrics
    gas_usage_percent = (gas_used / gas_limit) * 100 if gas_limit > 0 else 0
    cumulative_gas_used += gas_used
    block_fill_ratio = (block_size / max_block_size) * 100 if max_block_size > 0 else 0
    
    #derived metrics for os logs
    ram_usage_percent = (ram_used / total_ram) * 100 if total_ram > 0 else 0
    total_cpu_secs = cpu_user_secs + cpu_system_secs


    # Calculate block time difference from previous block
    block_time_diff = 0
    if previous_block_time:
        block_time_diff = timestamp - previous_block_time
        block_times.append(block_time_diff)
    previous_block_time = timestamp
    
    # Calculate average block time over last blocks
    avg_block_time = sum(block_times) / len(block_times) if block_times else 0

    # Track transaction rate (tx per second since last block)
    tx_rate = 0
    if block_time_diff > 0:
        tx_rate = transactions_count / block_time_diff
    previous_transactions = transactions_count

    # Gas efficiency (transactions per gas unit)
    gas_efficiency = transactions_count / gas_used if gas_used > 0 else 0

    # Determine network health score (simple version)
    network_health = 100
    if peer_count < 3:
        network_health -= 30
    if block_time_diff > 16:
        network_health -= 20
    if gas_usage_percent > 80:
        network_health -= 15
    if orphaned_blocks > 0:
        network_health -= 25
    if pending_txns > 50:
        network_health -= 10
    
    network_health = max(0, network_health)  # Ensure it doesn't go below 0

    

    # Organize data into requested sections
    performance = {
        "blockNumber": block_number,
        "blockTime": timestamp,
        "blockTimeDiff": round(block_time_diff, 2),
        "avgBlockTime": round(avg_block_time, 2),
        "transactionCount": transactions_count,
        "transactionRate": round(tx_rate, 3),
        "gasLimit": gas_limit,
        "gasUsed": gas_used, 
        "gasUsagePercent": round(gas_usage_percent, 2),
        "blockFillRatio": round(block_fill_ratio, 2),
        "gasEfficiency": round(gas_efficiency, 6)
    }

    network = {
        "peerCount": peer_count,
        "pendingTransactions": pending_txns,
        "totalDifficulty": total_difficulty,
        "chainId": chain_id,
        "orphanedBlocks": orphaned_blocks,
        "cumulativeGasUsed": cumulative_gas_used,
        "networkHealth": network_health
    }

    dashboard = {
        "networkHealthScore": network_health
    }
    system_metrics = {
        "totalRAM_MB": total_ram,
        "ramUsed_MB": ram_used,
        "ramAvailable_MB": ram_available,
        "ramUsagePercent": round(ram_usage_percent, 2),
        "cpuUserSecs": cpu_user_secs,
        "cpuSystemSecs": cpu_system_secs,
        "totalCpuSecs": round(total_cpu_secs, 2),
        "networkReceived_MB": network_received,
        "networkTransmitted_MB": network_transmitted,
        "systemLoadAvg1Min": system_load_avg_one_min,
        "systemLoadAvg5Min": system_load_avg_five_min,
        "systemLoadAvg15Min": system_load_avg_fifteen_min
    }

    # Current timestamp for the data point
    current_time = int(time.time())
    
    # Create the current data snapshot with organized sections
    current_data = {
        "timestamp": current_time,
        "performance": performance,
        "network": network,
        "system": system_metrics,
        "dashboard": dashboard
    }

    # Store this data into the cache (rolling window of 100 entries)
    # creating the history json object here
    data_cache.append(current_data)

    # Return the latest data plus history for frontend visualization
    return {
        "timestamp": current_time,
        "performance": performance,
        "network": network,
        "dashboard": dashboard,
        "history": list(data_cache)  # Send historical data for graphing
    }

# Save processed data to a file
async def save_data(processed_data):
    with open("processed_data.json", "w") as file:
        json.dump(processed_data, file, indent=4)
    print("✅ Data updated at", time.strftime("%H:%M:%S", time.localtime()))

# Fetch, process, and save once (called by Flask route now)
async def fetch_and_process_once():
    print("🔄 Fetching and processing data...")
    raw_data = await fetch_data()
    processed_data = await process_data(raw_data)
    await save_data(processed_data)
    return processed_data

# If running directly, fetch once for testing
if __name__ == "__main__":
    asyncio.run(fetch_and_process_once())
