"use client"

import { useEffect, useRef } from "react"
import { Activity } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card"
import { plotHistoryGraph, getHealthColor } from "../../utils/chartUtils"

const Dashboard = ({ data }) => {
  const blockTimeChartRef = useRef(null)
  const txChartRef = useRef(null)
  const diffChartRef = useRef(null)
  const pendingTxChartRef = useRef(null)
  const charts = useRef({})

  useEffect(() => {
    if (data) {
      const { history } = data
      plotHistoryGraph(
        blockTimeChartRef,
        "Block Time",
        history.map((h) => h.performance.blockNumber),
        history.map((h) => h.performance.blockTime),
        "#8b5cf6", // Purple color
        "#c4b5fd", // Light purple
        charts,
      )

      plotHistoryGraph(
        txChartRef,
        "Transaction Count",
        history.map((h) => h.performance.blockNumber),
        history.map((h) => h.performance.transactionCount),
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

      plotHistoryGraph(
        pendingTxChartRef,
        "Pending Transactions",
        history.map((h) => h.performance.blockNumber),
        history.map((h) => h.network.pendingTransactions),
        "#9333ea", // Vibrant purple
        "#f3e8ff", // Soft lavender
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

        <div className="grid grid-cols-2 gap-4">
          <div className="p-1 bg-purple-50 rounded-lg border border-purple-100">
            <h3 className="px-3 pt-2 text-purple-800 font-medium">Block Time</h3>
            <div className="h-48">
              <canvas ref={blockTimeChartRef}></canvas>
            </div>
          </div>

          <div className="p-1 bg-purple-50 rounded-lg border border-purple-100">
            <h3 className="px-3 pt-2 text-purple-800 font-medium">Transaction Count</h3>
            <div className="h-48">
              <canvas ref={txChartRef}></canvas>
            </div>
          </div>

          <div className="p-1 bg-purple-50 rounded-lg border border-purple-100">
            <h3 className="px-3 pt-2 text-purple-800 font-medium">Total Difficulty</h3>
            <div className="h-48">
              <canvas ref={diffChartRef}></canvas>
            </div>
          </div>

          <div className="p-1 bg-purple-50 rounded-lg border border-purple-100">
            <h3 className="px-3 pt-2 text-purple-800 font-medium">Pending Transactions</h3>
            <div className="h-48">
              <canvas ref={pendingTxChartRef}></canvas>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200 shadow-md mt-6">
          <h3 className="text-lg font-medium text-purple-900 mb-3 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Dashboard Alerts
          </h3>

          {/* Transaction Count Alerts */}
          {latestData.performance.transactionCount <= 10 && (
            <div className="mb-3 bg-green-50 border-l-4 border-green-500 rounded-md p-4 flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">Transaction Volume: Low</h3>
                <div className="mt-1 text-sm text-green-700">
                  <p>Current transaction count is {latestData.performance.transactionCount}, indicating low network usage. Perfect time for maintenance operations.</p>
                </div>
              </div>
            </div>
          )}

          {latestData.performance.transactionCount > 10 &&
            latestData.performance.transactionCount < 100 && (
              <div className="mb-3 bg-yellow-50 border-l-4 border-yellow-500 rounded-md p-4 flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">Transaction Volume: Moderate</h3>
                  <div className="mt-1 text-sm text-yellow-700">
                    <p>Transaction count has reached {latestData.performance.transactionCount}. Network activity is increasing - consider monitoring resource usage.</p>
                  </div>
                </div>
              </div>
            )}

          {latestData.performance.transactionCount >= 100 && (
            <div className="mb-3 bg-red-50 border-l-4 border-red-500 rounded-md p-4 flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Transaction Volume: High</h3>
                <div className="mt-1 text-sm text-red-700">
                  <p>Transaction count has surged to {latestData.performance.transactionCount}! This high volume may impact network performance and increase block production time.</p>
                </div>
              </div>
            </div>
          )}

          {/* Total Difficulty Alerts */}
          {data.history.length > 1 &&
            latestData.network.totalDifficulty > data.history[data.history.length - 2].network.totalDifficulty && (
              <div className="mb-3 bg-green-50 border-l-4 border-green-500 rounded-md p-4 flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">Difficulty: Increasing</h3>
                  <div className="mt-1 text-sm text-green-700">
                    <p>Total difficulty has increased to {latestData.network.totalDifficulty} from previous {data.history[data.history.length - 2].network.totalDifficulty}. Chain is progressing normally.</p>
                  </div>
                </div>
              </div>
            )}

          {data.history.length > 1 &&
            latestData.network.totalDifficulty <= data.history[data.history.length - 2].network.totalDifficulty && (
              <div className="mb-3 bg-red-50 border-l-4 border-red-500 rounded-md p-4 flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1v-5a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586l-4.293-4.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Difficulty: Not Increasing</h3>
                  <div className="mt-1 text-sm text-red-700">
                    <p>Total difficulty is {latestData.network.totalDifficulty}, not increasing from previous block! This may indicate a consensus issue or chain fork.</p>
                  </div>
                </div>
              </div>
            )}

          {/* Pending Transactions Alerts */}
          {latestData.network.pendingTransactions <= 5 && (
            <div className="mb-3 bg-green-50 border-l-4 border-green-500 rounded-md p-4 flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">Pending Queue: Clear</h3>
                <div className="mt-1 text-sm text-green-700">
                  <p>Only {latestData.network.pendingTransactions} transactions pending. Transaction processing is running smoothly with minimal backlog.</p>
                </div>
              </div>
            </div>
          )}

          {latestData.network.pendingTransactions > 5 &&
            latestData.network.pendingTransactions < 20 && (
              <div className="mb-3 bg-yellow-50 border-l-4 border-yellow-500 rounded-md p-4 flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">Pending Queue: Growing</h3>
                  <div className="mt-1 text-sm text-yellow-700">
                    <p>Transaction queue has {latestData.network.pendingTransactions} pending transactions. Monitor closely for potential congestion.</p>
                  </div>
                </div>
              </div>
            )}

          {latestData.network.pendingTransactions >= 20 && (
            <div className="mb-3 bg-red-50 border-l-4 border-red-500 rounded-md p-4 flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Pending Queue: Congested</h3>
                <div className="mt-1 text-sm text-red-700">
                  <p>High backlog with {latestData.network.pendingTransactions} pending transactions! Consider increasing block gas limit or optimizing transaction processing.</p>
                </div>
              </div>
            </div>
          )}

          {/* No Alerts Message */}
          {!latestData.performance.transactionCount &&
            !latestData.network.totalDifficulty &&
            !latestData.network.pendingTransactions && (
              <p className="text-purple-800 italic">No active alerts at this time. Network is operating normally.</p>
            )}
        </div>
      </CardContent>
    </Card>
  )
}

export default Dashboard