"use client"

import { useEffect, useRef } from "react"
import { Activity } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card"
import { plotHistoryGraph } from "../../utils/chartUtils"

const SystemMetrics = ({ data }) => {
  const cpuChartRef = useRef(null)
  const ramChartRef = useRef(null)
  const charts = useRef({})

  useEffect(() => {
    if (data) {
      const { history } = data

      plotHistoryGraph(
        cpuChartRef,
        "CPU Usage (%)",
        history.slice(1).map((h) => h.timestamp), // timestamps (skip the first because we need pairs)
        history.slice(1).map((h, idx) => {
          const latest = history[idx + 1];
          const prev = history[idx];

          let cpuTotal = 0;
          if (latest && prev) {
            const deltaUser = latest.system.cpuUserSecs - prev.system.cpuUserSecs;
            const deltaSystem = latest.system.cpuSystemSecs - prev.system.cpuSystemSecs;
            const deltaTotal = deltaUser + deltaSystem;
            cpuTotal = (deltaTotal / 8).toFixed(2); // same as your style
          }

          return Math.min(cpuTotal, 100); // cap at 100%
        }),
        "#22c55e", // Green
        "#bbf7d0", // Light green
        charts
      );


      plotHistoryGraph(
        ramChartRef,
        "RAM Usage (%)",
        history.map((h) => h.timestamp),
        history.map((h) => {
          const usagePercent = h.system.ramUsagePercent;
          return Math.min(usagePercent, 100);
        }),
        "#3b82f6", // Blue
        "#dbeafe", // Light blue
        charts
      );
    }

    return () => {
      Object.values(charts.current).forEach((chart) => chart.destroy())
    }
  }, [data])

  const latest = data.history.at(-1)
  const prev = data.history.at(-2)

  let cpuUser = 0, cpuSystem = 0, cpuTotal = 0, ramUsage = 0
  if (latest && prev) {
    const deltaUser = latest.system.cpuUserSecs - prev.system.cpuUserSecs
    const deltaSystem = latest.system.cpuSystemSecs - prev.system.cpuSystemSecs
    const deltaTotal = deltaUser + deltaSystem
    cpuUser = (deltaUser / 8).toFixed(2)  // 8 cores
    cpuSystem = (deltaSystem / 8).toFixed(2)
    cpuTotal = (deltaTotal / 8).toFixed(2)

    
    ramUsage = (latest.system.ramUsagePercent).toFixed(2)
  }

  return (
    <Card className="border border-green-200 shadow-lg bg-white/50 backdrop-blur-sm">
      <CardHeader className="border-b border-green-100 bg-gradient-to-r from-green-50 to-green-100">
        <CardTitle className="text-2xl text-green-900 flex items-center gap-2">
          <Activity className="h-6 w-6 text-green-700" />
          System Metrics
        </CardTitle>
        <CardDescription className="text-green-700">Live system resource usage overview</CardDescription>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-green-50 rounded-lg p-4 border border-green-100 shadow-sm">
            <p className="text-sm font-medium text-green-700 mb-1">CPU User %</p>
            <p className="text-2xl font-bold text-green-900">{cpuUser}%</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4 border border-green-100 shadow-sm">
            <p className="text-sm font-medium text-green-700 mb-1">CPU System %</p>
            <p className="text-2xl font-bold text-green-900">{cpuSystem}%</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4 border border-green-100 shadow-sm">
            <p className="text-sm font-medium text-green-700 mb-1">CPU Total %</p>
            <p className="text-2xl font-bold text-green-900">{cpuTotal}%</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4 border border-green-100 shadow-sm">
            <p className="text-sm font-medium text-green-700 mb-1">RAM Usage %</p>
            <p className="text-2xl font-bold text-green-900">{ramUsage}%</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-1 bg-green-50 rounded-lg border border-green-100">
            <h3 className="px-3 pt-2 text-green-800 font-medium">Total CPU Usage</h3>
            <div className="h-48">
              <canvas ref={cpuChartRef}></canvas>
            </div>
          </div>

          <div className="p-1 bg-green-50 rounded-lg border border-green-100">
            <h3 className="px-3 pt-2 text-green-800 font-medium">Memory Usage</h3>
            <div className="h-48">
              <canvas ref={ramChartRef}></canvas>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default SystemMetrics
