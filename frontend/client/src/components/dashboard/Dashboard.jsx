"use client"

import { useEffect, useRef } from "react"
import { Activity } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card"
import { plotHistoryGraph, getHealthColor } from "../../utils/chartUtils"

const Dashboard = ({ data }) => {
  const txChartRef = useRef(null)
  const gasChartRef = useRef(null)
  const diffChartRef = useRef(null)
  const charts = useRef({})

  useEffect(() => {
    if (data) {
      const { history } = data
      plotHistoryGraph(
        txChartRef,
        "Transaction Count",
        history.map((h) => h.performance.blockNumber),
        history.map((h) => h.performance.transactionCount),
        "#8b5cf6", // Purple color
        "#c4b5fd", // Light purple
        charts,
      )

      plotHistoryGraph(
        gasChartRef,
        "Gas Limit",
        history.map((h) => h.performance.blockNumber),
        history.map((h) => h.performance.gasLimit),
        "#7c3aed", // Darker purple
        "#ddd6fe", // Very light purple
        charts,
      )

      plotHistoryGraph(
        diffChartRef,
        "Total Difficulty",
        history.map((h) => h.performance.blockNumber),
        history.map((h) => h.network.totalDifficulty),
        "#6d28d9", // Deep purple
        "#ede9fe", // Pale purple
        charts,
      )
    }

    return () => {
      Object.values(charts.current).forEach((chart) => chart.destroy())
    }
  }, [data])

  const latestData = data.history.at(-1)
  const healthScore = latestData.dashboard.networkHealthScore

  return (
    <Card className="border border-purple-200 shadow-lg bg-white/50 backdrop-blur-sm">
      <CardHeader className="border-b border-purple-100 bg-gradient-to-r from-purple-50 to-purple-100">
        <CardTitle className="text-2xl text-purple-900 flex items-center gap-2">
          <Activity className="h-6 w-6 text-purple-700" />
          Dashboard Overview
        </CardTitle>
        <CardDescription className="text-purple-700">Real-time blockchain performance metrics</CardDescription>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-100 shadow-sm">
            <p className="text-sm font-medium text-purple-700 mb-1">Network Health</p>
            <p className={`text-2xl font-bold ${getHealthColor(healthScore)}`}>{healthScore}%</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-100 shadow-sm">
            <p className="text-sm font-medium text-purple-700 mb-1">Latest Block</p>
            <p className="text-2xl font-bold text-purple-900">#{latestData.performance.blockNumber}</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-100 shadow-sm">
            <p className="text-sm font-medium text-purple-700 mb-1">Peers</p>
            <p className="text-2xl font-bold text-purple-900">{latestData.network.peerCount}</p>
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
  )
}

export default Dashboard

