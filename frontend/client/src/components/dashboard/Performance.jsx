import { Server } from "lucide-react"
import { ArrowUpCircle, Activity } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../components/ui/tooltip"

const Performance = ({ data }) => {
    const latestData = data.history.at(-1)
    const prevData = data.history.at(-2)

    const getChangeIndicator = (current, previous) => {
        if (!previous) return null
        const isIncrease = current > previous
        const color = isIncrease ? "text-green-500" : "text-red-500"
        return (
            <span className={`inline-flex items-center ${color} ml-2`}>
                <ArrowUpCircle className={`h-4 w-4 ${!isIncrease ? "transform rotate-180" : ""}`} />
            </span>
        )
    }

    return (
        <TooltipProvider>
            <Card className="border border-purple-200 shadow-lg bg-white/50 backdrop-blur-sm">
                <CardHeader className="border-b border-purple-100 bg-gradient-to-r from-purple-50 to-purple-100">
                    <CardTitle className="text-2xl text-purple-900 flex items-center gap-2">
                        <Server className="h-6 w-6 text-purple-700" />
                        Performance Monitor
                    </CardTitle>
                    <CardDescription className="text-purple-700">Network performance monitor</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 flex-col">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div className="bg-purple-50 rounded-xl p-5 border border-purple-100 shadow-sm flex flex-col">
                                    <h3 className="text-sm font-medium text-purple-600">Block Number</h3>
                                    <p className="text-3xl font-bold text-purple-900 mt-1">
                                        #{latestData.performance.blockNumber}
                                        {getChangeIndicator(latestData.performance.blockNumber, prevData?.performance.blockNumber)}
                                    </p>
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>Current block height of the blockchain.</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div className="bg-purple-50 rounded-xl p-5 border border-purple-100 shadow-sm flex flex-col">
                                    <h3 className="text-sm font-medium text-purple-600">Timestamp</h3>
                                    <p className="text-3xl font-bold text-purple-900 mt-1">{new Date(latestData.performance.blockTime * 1000).toLocaleTimeString()}</p>
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>Time when the latest block was mined.</TooltipContent>
                        </Tooltip>
                    </div>

                    <div className="bg-purple-50 rounded-xl p-6 border border-purple-100 shadow-sm">
                        <h3 className="text-lg font-medium text-purple-800 mb-4">Performance monitoring parameters</h3>
                        <div className="space-y-4">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className="flex justify-between items-center pb-2 border-b border-purple-100 bg-purple-50 even:bg-purple-100 p-2 rounded">
                                        <span className="text-purple-700">Transaction Count</span>
                                        <span className="font-medium text-purple-900">{latestData.performance.transactionCount.toLocaleString()}
                                        </span>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>Number of transactions validated in the current block.</TooltipContent>
                            </Tooltip>

                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className="flex justify-between items-center pb-2 border-b border-purple-100 bg-purple-50 even:bg-purple-100 p-2 rounded">
                                        <span className="text-purple-700">Transaction Rate</span>
                                        <span className="font-medium text-purple-900">{latestData.performance.transactionRate.toLocaleString()} txns/sec</span>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>Number of transactions validated per second</TooltipContent>
                            </Tooltip>

                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className="flex justify-between items-center pb-2 border-b border-purple-100 bg-purple-50 even:bg-purple-100 p-2 rounded">
                                        <span className="text-purple-700">Gas Used</span>
                                        <span className="font-medium text-purple-900">{latestData.performance.gasUsed.toLocaleString()}</span>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>Gas fees used by the validator for this block.</TooltipContent>
                            </Tooltip>

                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className="flex justify-between items-center bg-purple-50 even:bg-purple-100 p-2 rounded">
                                        <span className="text-purple-700">Current Gas Limit</span>
                                        <Badge className="bg-green-100 text-green-800 hover:bg-green-200">{latestData.performance.gasLimit.toLocaleString()}</Badge>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>Maximum value of gas fees that can be used for this block.</TooltipContent>
                            </Tooltip>
                        </div>
                    </div>

                    <div className="bg-purple-100 rounded-xl p-6 border border-purple-200 shadow-md mt-6">
                        <h3 className="text-lg font-medium text-purple-900 mb-2">Data Insights</h3>
                        <p className="text-purple-800">There goes the data insights string...</p>
                    </div>
                </CardContent>
            </Card>
        </TooltipProvider>
    )
}

export default Performance
