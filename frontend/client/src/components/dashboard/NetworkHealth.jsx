import { Server } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"

const NetworkHealth = ({ data }) => {
  const latestData = data.history.at(-1)

  return (
    <Card className="border border-purple-200 shadow-lg bg-white/50 backdrop-blur-sm">
      <CardHeader className="border-b border-purple-100 bg-gradient-to-r from-purple-50 to-purple-100">
        <CardTitle className="text-2xl text-purple-900 flex items-center gap-2">
          <Server className="h-6 w-6 text-purple-700" />
          Network Health
        </CardTitle>
        <CardDescription className="text-purple-700">Network stability and performance indicators</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-purple-50 rounded-xl p-5 border border-purple-100 shadow-sm flex flex-col">
            <h3 className="text-sm font-medium text-purple-600">Peer Count</h3>
            <div className="mt-2 flex items-center">
              <div className="text-3xl font-bold text-purple-900">{latestData.network.peerCount}</div>
              <div
                className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                  latestData.network.peerCount > 5 ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {latestData.network.peerCount > 5 ? "Healthy" : "Low"}
              </div>
            </div>
          </div>

          <div className="bg-purple-50 rounded-xl p-5 border border-purple-100 shadow-sm flex flex-col">
            <h3 className="text-sm font-medium text-purple-600">Pending Transactions</h3>
            <div className="mt-2 flex items-center">
              <div className="text-3xl font-bold text-purple-900">{latestData.network.pendingTransactions}</div>
              <div
                className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                  latestData.network.pendingTransactions < 100
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {latestData.network.pendingTransactions < 100 ? "Normal" : "High"}
              </div>
            </div>
          </div>

          <div className="bg-purple-50 rounded-xl p-5 border border-purple-100 shadow-sm flex flex-col">
            <h3 className="text-sm font-medium text-purple-600">Chain ID</h3>
            <div className="mt-2">
              <div className="text-3xl font-bold text-purple-900">{latestData.network.chainId}</div>
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
  )
}

export default NetworkHealth

