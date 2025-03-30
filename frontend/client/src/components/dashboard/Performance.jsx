import { ArrowUpCircle, Activity } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"

const Performance = ({ data }) => {
  const latestData = data.history.at(-1)
  const prevData = data.history.at(-2)

  const getChangeIndicator = (current, previous) => {
    if (!previous) return null
    const isIncrease = current > previous
    const color = isIncrease ? "text-green-500" : "text-red-500"
    const Icon = isIncrease ? ArrowUpCircle : ArrowUpCircle
    return (
      <span className={`inline-flex items-center ${color} ml-2`}>
        <Icon className={`h-4 w-4 ${!isIncrease ? "transform rotate-180" : ""}`} />
      </span>
    )
  }

  return (
    <Card className="border border-purple-200 shadow-lg bg-white/50 backdrop-blur-sm">
      <CardHeader className="border-b border-purple-100 bg-gradient-to-r from-purple-50 to-purple-100">
        <CardTitle className="text-2xl text-purple-900 flex items-center gap-2">
          <Activity className="h-6 w-6 text-purple-700" />
          Performance Insights
        </CardTitle>
        <CardDescription className="text-purple-700">Detailed blockchain performance metrics</CardDescription>
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
                    {getChangeIndicator(latestData.performance.blockNumber, prevData?.performance.blockNumber)}
                  </p>
                </div>
                <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">Latest</Badge>
              </div>
            </div>

            <div className="bg-purple-50 rounded-xl p-5 border border-purple-100 shadow-sm">
              <h3 className="text-sm font-medium text-purple-600">Timestamp</h3>
              <p className="text-xl font-semibold text-purple-900 mt-1">{new Date().toLocaleTimeString()}</p>
            </div>
          </div>

          <div className="space-y-5">
            <div className="bg-purple-50 rounded-xl p-5 border border-purple-100 shadow-sm">
              <h3 className="text-sm font-medium text-purple-600">Transaction Count</h3>
              <p className="text-3xl font-bold text-purple-900 mt-1">
                {latestData.performance.transactionCount.toLocaleString()}
                {getChangeIndicator(latestData.performance.transactionCount, prevData?.performance.transactionCount)}
              </p>
              <div className="mt-2 text-sm text-purple-600">
                Gas Used: {latestData.performance.gasUsed.toLocaleString()}
              </div>
            </div>

            <div className="bg-purple-50 rounded-xl p-5 border border-purple-100 shadow-sm">
              <h3 className="text-sm font-medium text-purple-600">Gas Limit</h3>
              <p className="text-3xl font-bold text-purple-900 mt-1">
                {latestData.performance.gasLimit.toLocaleString()}
                {getChangeIndicator(latestData.performance.gasLimit, prevData?.performance.gasLimit)}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default Performance

