# Blockchain Network Monitor

A comprehensive real-time monitoring solution for blockchain networks with advanced analytics and visualization.

---

## Overview

**Blockchain Network Monitor** is a powerful, full-featured monitoring tool designed to provide real-time insights into blockchain network performance, health metrics, and system resource utilization.

The monitor continuously collects data from blockchain nodes, processes it into meaningful metrics, and presents it through a responsive web interface. This enables network operators and developers to quickly identify issues, optimize performance, and ensure network reliability.

> ⚡ **Note:** This monitor was specifically built and optimized for a **private blockchain network** that I developed during my **internship at IIT Bhilai** as a **Blockchain Developer**.  
> Installation instructions for general public use are not included yet, as the system is fine-tuned for that private deployment.

---

## Features

### 🖥 Real-Time Network Dashboard
- **Transaction Metrics:** Live count of total and pending transactions
- **Block Statistics:** Current block time and difficulty trends
- **Alert System:** Configurable threshold-based notifications for critical metrics
- **Auto-refresh:** Data updated every 15 seconds

![Real-time dashboard](images/Screenshot%20From%202025-04-10%2022-49-56.png)
![Real-time dashboard](images/Screenshot%20From%202025-04-10%2022-49-15.png)

---

### 📈 Performance Analytics
- **Transaction Volume:** Historical and current transaction throughput
- **Gas Usage:** Track gas consumption patterns across the network
- **Transaction Rate:** Measure TPS (transactions per second) in real-time
- **Performance Alerts:** Notifications when performance metrics exceed defined thresholds

![Performance dashboard](images/Screenshot%20From%202025-04-10%2022-48-46.png)

---

### 🩺 Network Health Monitoring
- **Peer Connectivity:** Monitor active peer count and distribution
- **Block Time Analysis:** Track average block times and detect anomalies
- **Network Status:** Overall health status with color-coded indicators
- **Historical Trends:** View network health metrics over customizable time periods

![Network health dashboard](images/Screenshot%20From%202025-04-10%2022-48-22.png)

---

### ⚙️ System Resource Metrics
- **CPU Utilization:** Real-time and historical CPU usage of blockchain nodes
- **Memory Usage:** RAM utilization with time-series visualization
- **Resource Graphs:** Interactive charts showing system performance over time
- **Resource Alerts:** Notifications for high resource consumption

![System metrics dashboard](images/Screenshot%20From%202025-04-10%2022-48-07.png)

---

### 🔍 Integrated Block Explorer
- **Transaction Lookup:** Detailed information for any transaction by hash
- **Contract Analysis:** Smart contract inspection and interaction data
- **Address Information:** Complete transaction history for blockchain addresses
- **Data Visualization:** Visual representation of contract interactions

![Block explorer ](images/Screenshot%20From%202025-04-10%2022-46-18.png)
![Block explorer ](images/Screenshot%20From%202025-04-10%2022-46-32.png)

---

## Architecture

Blockchain Network Monitor employs a modular architecture with specialized components for data collection, processing, and visualization:

### Backend Services
- **Express.js server:** Blockchain data collection every 15 seconds
- **Python Data Pipeline:** Advanced analytics and metric processing
- **Flask API:** Serving processed data to the frontend application

### System Monitoring
- **Node Exporter:** Collection of system metrics (CPU, Memory, Disk I/O)

### Frontend Application
- **React + Vite:** Fast and responsive user interface
- **Real-Time Visualization:** Interactive components for live metric tracking

---

## Additional Notes

- 🔨 This project is currently customized for internal use with a private blockchain setup.
- 📢 A public, generalized installation and configuration guide may be added in the future.

---

