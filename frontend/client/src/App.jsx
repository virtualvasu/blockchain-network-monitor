import { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import "./App.css";

const Dashboard = ({ data }) => {
    const txChartRef = useRef(null);
    const gasChartRef = useRef(null);
    const diffChartRef = useRef(null);
    const charts = useRef({});

    useEffect(() => {
        if (data) {
            const { history } = data;
            plotHistoryGraph(txChartRef, "Transaction Count vs Block Number", history.map(h => h.performance.blockNumber), history.map(h => h.performance.transactionCount));
            plotHistoryGraph(gasChartRef, "Gas Limit vs Block Number", history.map(h => h.performance.blockNumber), history.map(h => h.performance.gasLimit));
            plotHistoryGraph(diffChartRef, "Total Difficulty vs Block Number", history.map(h => h.performance.blockNumber), history.map(h => h.network.totalDifficulty));
        }
        return () => {
            Object.values(charts.current).forEach(chart => chart.destroy());
        };
    }, [data]);

    const plotHistoryGraph = (ref, label, xData, yData) => {
        if (ref.current) {
            const ctx = ref.current.getContext("2d");
            if (charts.current[label]) charts.current[label].destroy();
            charts.current[label] = new Chart(ctx, {
                type: "line",
                data: {
                    labels: xData,
                    datasets: [{ label, data: yData, borderColor: "blue", borderWidth: 2, fill: false }],
                },
                options: { responsive: true, scales: { y: { beginAtZero: true } } },
            });
        }
    };

    return (
        <div>
            <h2>📊 Dashboard</h2>
            <p><strong>Network Health Score:</strong> {data.history.at(-1).dashboard.networkHealthScore}</p>
            <h2>Graphs for Visualization</h2>
            <canvas ref={txChartRef}></canvas>
            <canvas ref={gasChartRef}></canvas>
            <canvas ref={diffChartRef}></canvas>
        </div>
    );
};

const Performance = ({ data }) => (
    <div>
        <h2>🛠️ Performance Insights</h2>
        <p><strong>Block Number:</strong> {data.history.at(-1).performance.blockNumber}</p>
        <p><strong>Transaction Count:</strong> {data.history.at(-1).performance.transactionCount}</p>
        <p><strong>Gas Used:</strong> {data.history.at(-1).performance.gasUsed}</p>
    </div>
);

const NetworkHealth = ({ data }) => (
    <div>
        <h2>🔗 Network Health</h2>
        <p><strong>Peer Count:</strong> {data.history.at(-1).network.peerCount}</p>
        <p><strong>Pending Transactions:</strong> {data.history.at(-1).network.pendingTransactions}</p>
        <p><strong>Total Difficulty:</strong> {data.history.at(-1).network.totalDifficulty}</p>
    </div>
);

const App = () => {
    const [data, setData] = useState(null);
    const [timer, setTimer] = useState(15);
    const [activeTab, setActiveTab] = useState("dashboard");

    useEffect(() => {
        fetchData();
        const fetchInterval = setInterval(fetchData, 15000);
        const countdownInterval = setInterval(() => {
            setTimer((prev) => (prev > 0 ? prev - 1 : 15));
        }, 1000);
        return () => {
            clearInterval(fetchInterval);
            clearInterval(countdownInterval);
        };
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch("http://127.0.0.1:5000/processed_data", { cache: "no-store" });
            if (!response.ok) throw new Error("Failed to fetch");
            const jsonData = await response.json();
            setData(jsonData.data);
            setTimer(15);
        } catch (error) {
            console.error("Error fetching data:", error);
            setData(null);
        }
    };

    return (
        <div className="app-container">
            <h1>Blockchain Performance Monitor</h1>
            <div className="chain-id">Chain ID: {data ? data.history.at(-1).network.chainId : "Loading..."}</div>
            <div className="timer">Next update in: {timer}s</div>
            
            <nav>
                <button onClick={() => setActiveTab("dashboard")}>Dashboard</button>
                <button onClick={() => setActiveTab("performance")}>Performance</button>
                <button onClick={() => setActiveTab("networkHealth")}>Network Health</button>
            </nav>
            
            <div className="content">
                {data ? (
                    activeTab === "dashboard" ? <Dashboard data={data} /> :
                    activeTab === "performance" ? <Performance data={data} /> :
                    <NetworkHealth data={data} />
                ) : (
                    <p>Loading data...</p>
                )}
            </div>
        </div>
    );
};

export default App;
