import { Server } from "lucide-react"
import { ArrowUpCircle } from "lucide-react"
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


                    <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200 shadow-md mt-6">
                        <h3 className="text-lg font-medium text-purple-900 mb-3 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Performance Alerts
                        </h3>

                        {/* Gas Usage Alerts */}
                        {latestData.performance.gasUsed < 150000000 && (
                            <div className="mb-3 bg-yellow-50 border-l-4 border-yellow-500 rounded-md p-4 flex items-start">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-yellow-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-yellow-800">Unusual Gas Usage: Below Standard</h3>
                                    <div className="mt-1 text-sm text-yellow-700">
                                        <p>Gas usage of {latestData.performance.gasUsed.toLocaleString()} is below the standard. This indicates the block is not used much (low network activity, cheap transactions).

                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {(latestData.performance.gasUsed > 150000000 && latestData.performance.gasUsed < 210000000) && (
                            <div className="mb-3 bg-green-50 border-l-4 border-green-500 rounded-md p-4 flex items-start">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-green-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-green-800">Standard Gas Usage</h3>
                                    <div className="mt-1 text-sm text-green-700">
                                        <p>Block moderately filled (healthy, expected network activity)</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {latestData.performance.gasUsed > 210000000 && (
                            <div className="mb-3 bg-red-50 border-l-4 border-red-500 rounded-md p-4 flex items-start">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-red-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-red-800">High Gas Usage</h3>
                                    <div className="mt-1 text-sm text-red-700">
                                        <p>Gas usage of {latestData.performance.gasUsed.toLocaleString()} is above standard levels. This indicates complex transactions or smart contract executions. Monitor network congestion.</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Transaction Rate Alerts */}
                        {latestData.performance.transactionRate === 0 && (
                            <div className="mb-3 bg-yellow-50 border-l-4 border-yellow-500 rounded-md p-4 flex items-start">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-yellow-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M10 2a5.5 5.5 0 00-3.096 10.047 9.005 9.005 0 00-5.9 8.18.75.75 0 001.5.045 7.5 7.5 0 0114.993 0 .75.75 0 001.499-.044 9.005 9.005 0 00-5.9-8.181A5.5 5.5 0 0010 2z" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-yellow-800">Transaction Rate: Idle</h3>
                                    <div className="mt-1 text-sm text-yellow-700">
                                        <p>No transactions are currently being processed. Network activity has stopped or is experiencing issues. Consider investigating if this persists.</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {latestData.performance.transactionRate > 0 && latestData.performance.transactionRate < 5 && (
                            <div className="mb-3 bg-green-50 border-l-4 border-green-500 rounded-md p-4 flex items-start">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-green-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-green-800">Transaction Rate: Normal</h3>
                                    <div className="mt-1 text-sm text-green-700">
                                        <p>Processing {latestData.performance.transactionRate.toLocaleString()} transactions per second. Network is operating within expected parameters.</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {latestData.performance.transactionRate >= 5 && (
                            <div className="mb-3 bg-red-50 border-l-4 border-red-500 rounded-md p-4 flex items-start">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-red-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-red-800">Transaction Rate: High Load</h3>
                                    <div className="mt-1 text-sm text-red-700">
                                        <p>Processing {latestData.performance.transactionRate.toLocaleString()} transactions per second! This high throughput may impact node performance. Monitor system resources closely.</p>
                                    </div>
                                </div>
                            </div>
                        )}

                       

                        {/* No Alerts Message */}
                        {!latestData.performance.gasUsed && !latestData.performance.transactionRate && !prevData && (
                            <p className="text-purple-800 italic">No performance alerts at this time. System is operating within normal parameters.</p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </TooltipProvider>
    )
}

export default Performance
