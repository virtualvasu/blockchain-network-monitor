import { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./components/ui/tabs";
import { Badge } from "./components/ui/badge";
import { Skeleton } from "./components/ui/skeleton";
import { ArrowUpCircle, Activity, Database, RefreshCw, Server } from "lucide-react";
import "./App.css";

// Custom chart theme configuration
Chart.defaults.color = "#a78bfa";
Chart.defaults.borderColor = "#4c1d95";
Chart.defaults.font.family = "Inter, sans-serif";

const Dashboard = ({ data }) => {
  const txChartRef = useRef(null);
  const gasChartRef = useRef(null);
  const diffChartRef = useRef(null);
  const charts = useRef({});

  useEffect(() => {
    if (data) {
      const { history } = data;
      plotHistoryGraph(
        txChartRef, 
        "Transaction Count", 
        history.map(h => h.performance.blockNumber), 
        history.map(h => h.performance.transactionCount),
        "#8b5cf6", // Purple color
        "#c4b5fd" // Light purple
      );
      
      plotHistoryGraph(
        gasChartRef, 
        "Gas Limit", 
        history.map(h => h.performance.blockNumber), 
        history.map(h => h.performance.gasLimit),
        "#7c3aed", // Darker purple
        "#ddd6fe" // Very light purple
      );
      
      plotHistoryGraph(
        diffChartRef, 
        "Total Difficulty", 
        history.map(h => h.performance.blockNumber), 
        history.map(h => h.network.totalDifficulty),
        "#6d28d9", // Deep purple
        "#ede9fe" // Pale purple
      );
    }
    
    return () => {
      Object.values(charts.current).forEach(chart => chart.destroy());
    };
  }, [data]);

  const plotHistoryGraph = (ref, label, xData, yData, borderColor, backgroundColor) => {
    if (ref.current) {
      const ctx = ref.current.getContext("2d");
      if (charts.current[label]) charts.current[label].destroy();
      
      charts.current[label] = new Chart(ctx, {
        type: "line",
        data: {
          labels: xData,
          datasets: [{ 
            label, 
            data: yData, 
            borderColor, 
            backgroundColor,
            borderWidth: 2,
            tension: 0.4,
            pointBackgroundColor: borderColor,
            pointBorderColor: "#fff",
            pointRadius: 4,
            pointHoverRadius: 6,
            fill: true,
          }],
        },
        options: { 
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: 'top',
              labels: {
                boxWidth: 10,
                usePointStyle: true,
                font: {
                  size: 12,
                  weight: 'bold'
                }
              }
            },
            tooltip: {
              backgroundColor: '#4c1d95',
              titleColor: '#fff',
              bodyColor: '#e9d5ff',
              borderColor: '#8b5cf6',
              borderWidth: 1,
              padding: 10,
              displayColors: false,
              callbacks: {
                title: function(tooltipItems) {
                  return `Block #${tooltipItems[0].label}`;
                }
              }
            }
          },
          scales: { 
            y: { 
              grid: {
                color: 'rgba(156, 163, 175, 0.15)',
              },
              ticks: {
                padding: 10,
              }
            },
            x: {
              grid: {
                display: false
              },
              ticks: {
                maxRotation: 0,
                maxTicksLimit: 8,
                padding: 10
              }
            }
          },
          animation: {
            duration: 2000,
            easing: 'easeOutQuart'
          }
        },
      });
    }
  };

  const latestData = data.history.at(-1);
  const healthScore = latestData.dashboard.networkHealthScore;
  
  const getHealthColor = (score) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <Card className="border border-purple-200 shadow-lg bg-white/50 backdrop-blur-sm">
      <CardHeader className="border-b border-purple-100 bg-gradient-to-r from-purple-50 to-purple-100">
        <CardTitle className="text-2xl text-purple-900 flex items-center gap-2">
          <Activity className="h-6 w-6 text-purple-700" />
          Dashboard Overview
        </CardTitle>
        <CardDescription className="text-purple-700">
          Real-time blockchain performance metrics
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-100 shadow-sm">
            <p className="text-sm font-medium text-purple-700 mb-1">Network Health</p>
            <p className={`text-2xl font-bold ${getHealthColor(healthScore)}`}>
              {healthScore}%
            </p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-100 shadow-sm">
            <p className="text-sm font-medium text-purple-700 mb-1">Latest Block</p>
            <p className="text-2xl font-bold text-purple-900">
              #{latestData.performance.blockNumber}
            </p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-100 shadow-sm">
            <p className="text-sm font-medium text-purple-700 mb-1">Peers</p>
            <p className="text-2xl font-bold text-purple-900">
              {latestData.network.peerCount}
            </p>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="p-1 bg-purple-50 rounded-lg border border-purple-100">
            <h3 className="px-3 pt-2 text-purple-800 font-medium">Transaction Count</h3>
            <div className="h-64">
              <canvas ref={txChartRef}></canvas>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-1 bg-purple-50 rounded-lg border border-purple-100">
              <h3 className="px-3 pt-2 text-purple-800 font-medium">Gas Limit</h3>
              <div className="h-48">
                <canvas ref={gasChartRef}></canvas>
              </div>
            </div>
            
            <div className="p-1 bg-purple-50 rounded-lg border border-purple-100">
              <h3 className="px-3 pt-2 text-purple-800 font-medium">Difficulty</h3>
              <div className="h-48">
                <canvas ref={diffChartRef}></canvas>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const Performance = ({ data }) => {
  const latestData = data.history.at(-1);
  const prevData = data.history.at(-2);
  
  const getChangeIndicator = (current, previous) => {
    if (!previous) return null;
    const isIncrease = current > previous;
    const color = isIncrease ? "text-green-500" : "text-red-500";
    const Icon = isIncrease ? ArrowUpCircle : ArrowUpCircle;
    return (
      <span className={`inline-flex items-center ${color} ml-2`}>
        <Icon className={`h-4 w-4 ${!isIncrease ? "transform rotate-180" : ""}`} />
      </span>
    );
  };

  return (
    <Card className="border border-purple-200 shadow-lg bg-white/50 backdrop-blur-sm">
      <CardHeader className="border-b border-purple-100 bg-gradient-to-r from-purple-50 to-purple-100">
        <CardTitle className="text-2xl text-purple-900 flex items-center gap-2">
          <Activity className="h-6 w-6 text-purple-700" />
          Performance Insights
        </CardTitle>
        <CardDescription className="text-purple-700">
          Detailed blockchain performance metrics
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-5">
            <div className="bg-purple-50 rounded-xl p-5 border border-purple-100 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-medium text-purple-600">Block Number</h3>
                  <p className="text-3xl font-bold text-purple-900 mt-1">
                    #{latestData.performance.blockNumber}
                    {getChangeIndicator(
                      latestData.performance.blockNumber,
                      prevData?.performance.blockNumber
                    )}
                  </p>
                </div>
                <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">Latest</Badge>
              </div>
            </div>
            
            <div className="bg-purple-50 rounded-xl p-5 border border-purple-100 shadow-sm">
              <h3 className="text-sm font-medium text-purple-600">Timestamp</h3>
              <p className="text-xl font-semibold text-purple-900 mt-1">
                {new Date().toLocaleTimeString()}
              </p>
            </div>
          </div>
          
          <div className="space-y-5">
            <div className="bg-purple-50 rounded-xl p-5 border border-purple-100 shadow-sm">
              <h3 className="text-sm font-medium text-purple-600">Transaction Count</h3>
              <p className="text-3xl font-bold text-purple-900 mt-1">
                {latestData.performance.transactionCount.toLocaleString()}
                {getChangeIndicator(
                  latestData.performance.transactionCount,
                  prevData?.performance.transactionCount
                )}
              </p>
              <div className="mt-2 text-sm text-purple-600">
                Gas Used: {latestData.performance.gasUsed.toLocaleString()}
              </div>
            </div>
            
            <div className="bg-purple-50 rounded-xl p-5 border border-purple-100 shadow-sm">
              <h3 className="text-sm font-medium text-purple-600">Gas Limit</h3>
              <p className="text-3xl font-bold text-purple-900 mt-1">
                {latestData.performance.gasLimit.toLocaleString()}
                {getChangeIndicator(
                  latestData.performance.gasLimit,
                  prevData?.performance.gasLimit
                )}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const NetworkHealth = ({ data }) => {
  const latestData = data.history.at(-1);
  
  return (
    <Card className="border border-purple-200 shadow-lg bg-white/50 backdrop-blur-sm">
      <CardHeader className="border-b border-purple-100 bg-gradient-to-r from-purple-50 to-purple-100">
        <CardTitle className="text-2xl text-purple-900 flex items-center gap-2">
          <Server className="h-6 w-6 text-purple-700" />
          Network Health
        </CardTitle>
        <CardDescription className="text-purple-700">
          Network stability and performance indicators
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-purple-50 rounded-xl p-5 border border-purple-100 shadow-sm flex flex-col">
            <h3 className="text-sm font-medium text-purple-600">Peer Count</h3>
            <div className="mt-2 flex items-center">
              <div className="text-3xl font-bold text-purple-900">
                {latestData.network.peerCount}
              </div>
              <div className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                latestData.network.peerCount > 5 ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
              }`}>
                {latestData.network.peerCount > 5 ? "Healthy" : "Low"}
              </div>
            </div>
          </div>
          
          <div className="bg-purple-50 rounded-xl p-5 border border-purple-100 shadow-sm flex flex-col">
            <h3 className="text-sm font-medium text-purple-600">Pending Transactions</h3>
            <div className="mt-2 flex items-center">
              <div className="text-3xl font-bold text-purple-900">
                {latestData.network.pendingTransactions}
              </div>
              <div className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                latestData.network.pendingTransactions < 100 ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
              }`}>
                {latestData.network.pendingTransactions < 100 ? "Normal" : "High"}
              </div>
            </div>
          </div>
          
          <div className="bg-purple-50 rounded-xl p-5 border border-purple-100 shadow-sm flex flex-col">
            <h3 className="text-sm font-medium text-purple-600">Chain ID</h3>
            <div className="mt-2">
              <div className="text-3xl font-bold text-purple-900">
                {latestData.network.chainId}
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-purple-50 rounded-xl p-6 border border-purple-100 shadow-sm">
          <h3 className="text-lg font-medium text-purple-800 mb-4">Network Details</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-purple-100">
              <span className="text-purple-700">Total Difficulty</span>
              <span className="font-medium text-purple-900">{latestData.network.totalDifficulty.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-purple-100">
              <span className="text-purple-700">Health Score</span>
              <span className="font-medium text-purple-900">{latestData.dashboard.networkHealthScore}%</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-purple-100">
              <span className="text-purple-700">Block Time (avg)</span>
              <span className="font-medium text-purple-900">~15s</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-purple-700">Network Status</span>
              <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Active</Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const LoadingState = () => (
  <div className="space-y-6">
    <div className="space-y-2">
      <Skeleton className="h-10 w-1/3 mx-auto" />
      <Skeleton className="h-4 w-1/4 mx-auto" />
    </div>
    
    <Card className="border border-purple-200">
      <CardHeader>
        <Skeleton className="h-8 w-1/3" />
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-64 w-full" />
        <div className="grid grid-cols-3 gap-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </CardContent>
    </Card>
  </div>
);

const App = () => {
  const [data, setData] = useState(null);
  const [timer, setTimer] = useState(15);
  const [isLoading, setIsLoading] = useState(true);
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
      setIsLoading(true);
      const response = await fetch("http://127.0.0.1:5000/processed_data", { cache: "no-store" });
      if (!response.ok) throw new Error("Failed to fetch");
      const jsonData = await response.json();
      setData(jsonData.data);
      setTimer(15);
    } catch (error) {
      console.error("Error fetching data:", error);
      setData(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-purple-900 mb-2">
            Blockchain Performance Monitor
          </h1>
          <p className="text-purple-600 mb-4">
            Real-time analytics and monitoring dashboard
          </p>
          
          <div className="flex items-center justify-center gap-4 text-sm">
            <div className="bg-white px-3 py-1 rounded-full border border-purple-200 shadow-sm flex items-center">
              <Database className="h-4 w-4 text-purple-500 mr-1" />
              <span className="text-purple-800">
                Chain ID: {data ? data.history.at(-1).network.chainId : "..."}
              </span>
            </div>
            
            <div className="bg-white px-3 py-1 rounded-full border border-purple-200 shadow-sm flex items-center">
              <RefreshCw className={`h-4 w-4 mr-1 text-purple-500 ${timer <= 5 ? "animate-spin" : ""}`} />
              <span className="text-purple-800">Update in {timer}s</span>
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fetchData}
              className="border-purple-200 text-purple-700 hover:bg-purple-100 hover:text-purple-900"
            >
              Refresh Now
            </Button>
          </div>
        </div>
        
        <Tabs 
          defaultValue="dashboard" 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList className="flex justify-center space-x-2 bg-purple-100/80 p-1 rounded-lg w-fit mx-auto">
            <TabsTrigger 
              value="dashboard"
              className="data-[state=active]:bg-white data-[state=active]:text-purple-900 data-[state=active]:shadow-sm px-4 py-2 rounded-md text-purple-700"
            >
              Dashboard
            </TabsTrigger>
            <TabsTrigger 
              value="performance"
              className="data-[state=active]:bg-white data-[state=active]:text-purple-900 data-[state=active]:shadow-sm px-4 py-2 rounded-md text-purple-700"
            >
              Performance
            </TabsTrigger>
            <TabsTrigger 
              value="networkHealth"
              className="data-[state=active]:bg-white data-[state=active]:text-purple-900 data-[state=active]:shadow-sm px-4 py-2 rounded-md text-purple-700"
            >
              Network Health
            </TabsTrigger>
          </TabsList>
          
          <div className="bg-white/30 backdrop-blur-sm p-1 rounded-xl border border-purple-100 shadow-xl">
            <TabsContent value="dashboard" className="mt-0">
              {isLoading || !data ? <LoadingState /> : <Dashboard data={data} />}
            </TabsContent>
            <TabsContent value="performance" className="mt-0">
              {isLoading || !data ? <LoadingState /> : <Performance data={data} />}
            </TabsContent>
            <TabsContent value="networkHealth" className="mt-0">
              {isLoading || !data ? <LoadingState /> : <NetworkHealth data={data} />}
            </TabsContent>
          </div>
        </Tabs>
        
        <div className="text-center mt-6 text-purple-500 text-xs">
          © 2025 Blockchain Monitor • Refreshed at {new Date().toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};

export default App;