import { useState } from "react"
import {
    Search, AlertCircle, CheckCircle2, ArrowRight, FileCode, Banknote,
    ArrowUpRight, Hash, Clock, Cpu, Code, Table, Coins,
    FileText, Shield, Settings, RefreshCw
} from "lucide-react"
import { Button } from "../ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../ui/card"
import { Input } from "../ui/input"
import { Alert, AlertDescription } from "../ui/alert"
import { Skeleton } from "../ui/skeleton"
import { Badge } from "../ui/badge"
import { Separator } from "../ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from "../ui/tooltip"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog"

const TransactionSkeleton = () => (
    <div className="space-y-4">
        <Skeleton className="h-8 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-12" />
            <Skeleton className="h-12" />
        </div>
        <Skeleton className="h-24 w-full" />
    </div>
)

const ContractSkeleton = () => (
    <div className="space-y-4">
        <Skeleton className="h-8 w-full" />
        <div className="grid grid-cols-1 gap-4">
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-12" />
            <Skeleton className="h-12" />
        </div>
        <Skeleton className="h-32 w-full" />
    </div>
)

// Helper function to format addresses
const formatAddress = (address) => {
    if (!address) return "";
    return `${address.substring(0, 10)}...${address.substring(address.length - 8)}`
}

// Helper to convert hex values
const fromHex = (hexValue) => hexValue ? parseInt(hexValue, 16) : 0

// Helper to format contract code for display
const formatContractCode = (code) => {
    if (!code || code === "0x") return "No code found (not a contract)";
    if (code.length > 1000) {
        return `${code.substring(0, 1000)}... (${(code.length / 2 - 1).toLocaleString()} bytes)`;
    }
    return code;
}

const BlockExplorer = () => {
    // Transaction states
    const [txHash, setTxHash] = useState("")
    const [txData, setTxData] = useState(null)
    const [txLoading, setTxLoading] = useState(false)
    const [txError, setTxError] = useState("")
    const [isContract, setIsContract] = useState(false)

    // Contract states
    const [contractAddress, setContractAddress] = useState("")
    const [contractData, setContractData] = useState(null)
    const [contractLoading, setContractLoading] = useState(false)
    const [contractError, setContractError] = useState("")
    const [activeExplorerTab, setActiveExplorerTab] = useState("transaction")

    // Fetch transaction details
    const fetchTransaction = async () => {
        if (!txHash) return
        setTxLoading(true)
        setTxError("")
        setIsContract(false)
        try {
            const res = await fetch("http://localhost:8550", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    jsonrpc: "2.0",
                    method: "eth_getTransactionByHash",
                    params: [txHash],
                    id: 1,
                }),
            })
            const json = await res.json()
            if (json.result) {
                setTxData(json.result)

                // Check if this is a contract creation transaction
                if (!json.result.to) {
                    setIsContract(true)
                } else {
                    // Check if the "to" address is a contract
                    await checkIfContract(json.result.to)
                }
            } else {
                setTxError("Transaction not found or invalid hash.")
            }
        } catch (error) {
            setTxError("Failed to fetch transaction.")
        } finally {
            setTxLoading(false)
        }
    }

    // Check if an address is a contract
    const checkIfContract = async (address) => {
        try {
            const res = await fetch("http://localhost:8550", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    jsonrpc: "2.0",
                    method: "eth_getCode",
                    params: [address, "latest"],
                    id: 1,
                }),
            })
            const json = await res.json()
            // If there's code at this address, it's a contract
            setIsContract(json.result && json.result !== "0x")
        } catch (error) {
            console.error("Failed to check if address is a contract:", error)
        }
    }

    // Fetch contract details
    const fetchContract = async () => {
        if (!contractAddress) return
        setContractLoading(true)
        setContractError("")
        setContractData(null)

        try {
            // Get contract code
            const codeRes = await fetch("http://localhost:8550", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    jsonrpc: "2.0",
                    method: "eth_getCode",
                    params: [contractAddress, "latest"],
                    id: 1,
                }),
            })
            const codeJson = await codeRes.json()

            // Get contract balance
            const balanceRes = await fetch("http://localhost:8550", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    jsonrpc: "2.0",
                    method: "eth_getBalance",
                    params: [contractAddress, "latest"],
                    id: 2,
                }),
            })
            const balanceJson = await balanceRes.json()

            // Get storage at index 0 (just as an example)
            const storageRes = await fetch("http://localhost:8550", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    jsonrpc: "2.0",
                    method: "eth_getStorageAt",
                    params: [contractAddress, "0x0", "latest"],
                    id: 3,
                }),
            })
            const storageJson = await storageRes.json()

            const isContractAccount = codeJson.result && codeJson.result !== "0x"

            if (isContractAccount) {
                setContractData({
                    address: contractAddress,
                    code: codeJson.result,
                    balance: balanceJson.result,
                    storage: storageJson.result,
                    bytecodeSize: codeJson.result ? (codeJson.result.length / 2 - 1) : 0
                })
            } else {
                setContractError("This address is not a contract.")
            }
        } catch (error) {
            setContractError("Failed to fetch contract details.")
        } finally {
            setContractLoading(false)
        }
    }

    // Copy to clipboard function
    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text)
            .then(() => {
                // Could add a toast notification here
            })
            .catch(err => {
                console.error('Failed to copy: ', err)
            })
    }

    // View contract details from transaction
    const viewContractFromTx = () => {
        if (txData && !txData.to) {
            // This is a contract creation transaction - we'd need to get the created contract address
            // from a transaction receipt, which would require another API call
            alert("Contract creation - address needs to be determined from transaction receipt")
        } else if (txData && txData.to && isContract) {
            setContractAddress(txData.to)
            fetchContract()
            setActiveExplorerTab("contract")
        }
    }

    return (
        <div className="p-6 space-y-6">
            <div className="max-w-3xl mx-auto">
                <Card className="border-purple-200 shadow-md">
                    <CardHeader className="bg-purple-50 border-b border-purple-100 pb-4">
                        <CardTitle className="text-purple-900 flex items-center gap-2">
                            <Hash className="h-5 w-5" />
                            Blockchain Explorer
                        </CardTitle>
                        <CardDescription>
                            Search and view detailed transaction and contract information on the blockchain
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <Tabs
                            defaultValue="transaction"
                            value={activeExplorerTab}
                            onValueChange={setActiveExplorerTab}
                            className="space-y-4"
                        >
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="transaction">Search Transaction</TabsTrigger>
                                <TabsTrigger value="contract">Lookup Contract</TabsTrigger>
                            </TabsList>

                            <TabsContent value="transaction" className="space-y-4">
                                <div className="flex flex-col md:flex-row gap-2">
                                    <Input
                                        type="text"
                                        placeholder="Enter Transaction Hash (0x...)"
                                        value={txHash}
                                        onChange={(e) => setTxHash(e.target.value)}
                                        className="flex-1 border-purple-200 focus:border-purple-400 focus:ring-purple-300"
                                    />
                                    <Button
                                        onClick={fetchTransaction}
                                        disabled={!txHash || txLoading}
                                        className="bg-purple-600 hover:bg-purple-700 text-white"
                                    >
                                        {txLoading ? (
                                            <>
                                                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                                Searching...
                                            </>
                                        ) : (
                                            <>
                                                <Search className="h-4 w-4 mr-2" />
                                                Search
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </TabsContent>

                            <TabsContent value="contract" className="space-y-4">
                                <div className="flex flex-col md:flex-row gap-2">
                                    <Input
                                        type="text"
                                        placeholder="Enter Contract Address (0x...)"
                                        value={contractAddress}
                                        onChange={(e) => setContractAddress(e.target.value)}
                                        className="flex-1 border-purple-200 focus:border-purple-400 focus:ring-purple-300"
                                    />
                                    <Button
                                        onClick={fetchContract}
                                        disabled={!contractAddress || contractLoading}
                                        className="bg-purple-600 hover:bg-purple-700 text-white"
                                    >
                                        {contractLoading ? (
                                            <>
                                                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                                Loading...
                                            </>
                                        ) : (
                                            <>
                                                <Code className="h-4 w-4 mr-2" />
                                                Lookup
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>

                {/* Transaction Error */}
                {txError && activeExplorerTab === "transaction" && (
                    <Alert variant="destructive" className="mt-4 border-red-300 bg-red-50">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="ml-2">{txError}</AlertDescription>
                    </Alert>
                )}

                {/* Contract Error */}
                {contractError && activeExplorerTab === "contract" && (
                    <Alert variant="destructive" className="mt-4 border-red-300 bg-red-50">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="ml-2">{contractError}</AlertDescription>
                    </Alert>
                )}

                {/* Transaction Loading */}
                {txLoading && activeExplorerTab === "transaction" && (
                    <Card className="mt-4 border-purple-100">
                        <CardContent className="pt-6">
                            <TransactionSkeleton />
                        </CardContent>
                    </Card>
                )}

                {/* Contract Loading */}
                {contractLoading && activeExplorerTab === "contract" && (
                    <Card className="mt-4 border-purple-100">
                        <CardContent className="pt-6">
                            <ContractSkeleton />
                        </CardContent>
                    </Card>
                )}

                {/* Transaction Details */}
                {txData && !txLoading && activeExplorerTab === "transaction" && (
                    <Card className="mt-6 border-purple-200 overflow-hidden shadow-md">
                        <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-white flex items-center gap-2">
                                    <CheckCircle2 className="h-5 w-5" />
                                    Transaction Details
                                </CardTitle>
                                <div className="flex gap-2">
                                    {isContract && (
                                        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 cursor-pointer" onClick={viewContractFromTx}>
                                            <Code className="h-3 w-3 mr-1" />
                                            {!txData.to ? "Contract Creation" : "Contract Interaction"}
                                        </Badge>
                                    )}
                                    <Badge className="bg-white text-purple-700 hover:bg-purple-100">
                                        {txData.blockNumber ? `Block #${fromHex(txData.blockNumber)}` : 'Pending'}
                                    </Badge>
                                </div>
                            </div>
                            <CardDescription className="text-purple-100">
                                Transaction Hash:
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <button
                                                onClick={() => copyToClipboard(txData.hash)}
                                                className="ml-2 text-white font-mono text-xs hover:underline"
                                            >
                                                {txData.hash}
                                            </button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Click to copy</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </CardDescription>
                        </CardHeader>

                        <Tabs defaultValue="overview" className="w-full">
                            <div className="px-6 pt-6 border-b">
                                <TabsList className="bg-purple-100/60 w-full justify-start">
                                    <TabsTrigger
                                        value="overview"
                                        className="data-[state=active]:bg-white data-[state=active]:text-purple-700 rounded-t-lg border-b-0"
                                    >
                                        Overview
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="data"
                                        className="data-[state=active]:bg-white data-[state=active]:text-purple-700 rounded-t-lg border-b-0"
                                    >
                                        Data & Logs
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="advanced"
                                        className="data-[state=active]:bg-white data-[state=active]:text-purple-700 rounded-t-lg border-b-0"
                                    >
                                        Advanced
                                    </TabsTrigger>
                                </TabsList>
                            </div>

                            <TabsContent value="overview" className="p-0 m-0">
                                <CardContent className="pt-6 space-y-6">
                                    {/* Transaction Flow */}
                                    <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                                        <h3 className="font-medium text-purple-800 mb-4 flex items-center">
                                            Transaction Flow
                                            {isContract && (
                                                <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700 border-blue-200">
                                                    <Code className="h-3 w-3 mr-1" /> Contract {!txData.to ? "Creation" : "Interaction"}
                                                </Badge>
                                            )}
                                        </h3>
                                        <div className="flex items-center justify-between gap-2">
                                            <div className="w-5/12">
                                                <div className="font-medium text-sm text-purple-900">From</div>
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <button
                                                                onClick={() => copyToClipboard(txData.from)}
                                                                className="w-full text-left px-3 py-2 bg-white rounded-lg border border-purple-200 text-sm font-mono truncate block hover:bg-purple-50"
                                                            >
                                                                {txData.from}
                                                            </button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Click to copy address</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </div>

                                            <div className="flex-shrink-0">
                                                <div className="w-10 h-10 flex items-center justify-center bg-purple-100 rounded-full">
                                                    <ArrowRight className="h-6 w-6 text-purple-600" />
                                                </div>
                                            </div>

                                            <div className="w-5/12">
                                                <div className="font-medium text-sm text-purple-900">To</div>
                                                {txData.to ? (
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <button
                                                                    onClick={() => copyToClipboard(txData.to)}
                                                                    className={`w-full text-left px-3 py-2 rounded-lg border text-sm font-mono truncate block 
                                    ${isContract
                                                                            ? "bg-blue-50 border-blue-200 hover:bg-blue-100"
                                                                            : "bg-white border-purple-200 hover:bg-purple-50"}`}
                                                                >
                                                                    {txData.to}
                                                                    {isContract && (
                                                                        <span className="ml-2 text-xs text-blue-600">(Contract)</span>
                                                                    )}
                                                                </button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p>Click to copy address</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                ) : (
                                                    <div className="px-3 py-2 bg-blue-50 rounded-lg border border-blue-200 text-sm font-medium text-blue-800 flex items-center">
                                                        <FileCode className="h-4 w-4 mr-2" />
                                                        Contract Creation
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Transaction Value & Details */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="rounded-lg border border-green-100 bg-green-50 p-4">
                                            <div className="flex items-center gap-3 mb-1">
                                                <Banknote className="h-5 w-5 text-green-600" />
                                                <h3 className="font-medium text-green-800">Value</h3>
                                            </div>
                                            <div className="text-2xl font-bold text-green-700 mt-2">
                                                {(fromHex(txData.value) / 1e18).toFixed(6)} ETH
                                            </div>
                                            {txData.value !== "0x0" && (
                                                <div className="text-sm text-green-600 mt-1">
                                                    ≈ ${((fromHex(txData.value) / 1e18) * 3500).toFixed(2)} USD
                                                </div>
                                            )}
                                        </div>

                                        <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
                                            <div className="flex items-center gap-3 mb-1">
                                                <Cpu className="h-5 w-5 text-blue-600" />
                                                <h3 className="font-medium text-blue-800">Gas & Fees</h3>
                                            </div>
                                            <div className="mt-2 space-y-1">
                                                <div className="flex justify-between">
                                                    <span className="text-blue-700">Gas Limit:</span>
                                                    <span className="font-medium">{fromHex(txData.gas).toLocaleString()}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-blue-700">Gas Price:</span>
                                                    <span className="font-medium">
                                                        {txData.gasPrice ? (fromHex(txData.gasPrice) / 1e9).toFixed(2) + ' Gwei' : 'N/A'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Additional Details */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="bg-white border border-gray-200 rounded-lg p-3">
                                            <div className="text-gray-500 text-sm">Nonce</div>
                                            <div className="font-medium">{fromHex(txData.nonce)}</div>
                                        </div>
                                        <div className="bg-white border border-gray-200 rounded-lg p-3">
                                            <div className="text-gray-500 text-sm">Position</div>
                                            <div className="font-medium">
                                                {txData.transactionIndex ?
                                                    `#${fromHex(txData.transactionIndex)}` :
                                                    'Pending'}
                                            </div>
                                        </div>
                                        <div className="bg-white border border-gray-200 rounded-lg p-3">
                                            <div className="text-gray-500 text-sm">Status</div>
                                            <div className="font-medium text-green-600 flex items-center">
                                                <CheckCircle2 className="h-4 w-4 mr-1" />
                                                Success
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </TabsContent>

                            <TabsContent value="data" className="p-0 m-0">
                                <CardContent className="pt-6 space-y-4">
                                    <div>
                                        <h3 className="font-medium text-purple-800 mb-2 flex items-center">
                                            Input Data
                                            {txData.input && txData.input !== "0x" && txData.input.length > 10 && (
                                                <Badge className="ml-2 bg-amber-50 text-amber-700 border-amber-200">
                                                    {(txData.input.length / 2 - 1).toLocaleString()} bytes
                                                </Badge>
                                            )}
                                        </h3>
                                        <div className="bg-gray-50 rounded-lg border border-gray-200 p-3">
                                            <pre className="overflow-x-auto text-xs font-mono whitespace-pre-wrap break-all">
                                                {txData.input && txData.input !== "0x" ?
                                                    txData.input :
                                                    <span className="text-gray-500">No input data</span>}
                                            </pre>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="font-medium text-purple-800 mb-2">Event Logs</h3>
                                        <div className="bg-gray-50 rounded-lg border border-gray-200 p-3 h-40 flex items-center justify-center">
                                            <div className="text-gray-500 text-sm">
                                                Event logs would be displayed here (requires separate API call)
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </TabsContent>

                            <TabsContent value="advanced" className="p-0 m-0">
                                <CardContent className="pt-6">
                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="font-medium text-purple-800 mb-3">Raw Transaction Details</h3>
                                            <div className="grid grid-cols-1 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                                                <div className="flex flex-col">
                                                    <span className="text-sm text-gray-500">Block Hash</span>
                                                    <span className="font-mono text-sm break-all">{txData.blockHash || 'Pending'}</span>
                                                </div>
                                                <Separator />
                                                <div className="flex flex-col">
                                                    <span className="text-sm text-gray-500">V</span>
                                                    <span className="font-mono text-sm">{txData.v || 'N/A'}</span>
                                                </div>
                                                <Separator />
                                                <div className="flex flex-col">
                                                    <span className="text-sm text-gray-500">R</span>
                                                    <span className="font-mono text-sm">{txData.r || 'N/A'}</span>
                                                </div>
                                                <Separator />
                                                <div className="flex flex-col">
                                                    <span className="text-sm text-gray-500">S</span>
                                                    <span className="font-mono text-sm">{txData.s || 'N/A'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </TabsContent>
                        </Tabs>

                        
                    </Card>
                )}

                {/* Contract Details */}
                {contractData && !contractLoading && activeExplorerTab === "contract" && (
                    <Card className="mt-6 border-purple-200 overflow-hidden shadow-md">
                        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-white flex items-center gap-2">
                                    <Code className="h-5 w-5" />
                                    Contract Details
                                </CardTitle>
                                <Badge className="bg-white text-blue-700 hover:bg-blue-100">
                                    <Shield className="h-3 w-3 mr-1" />
                                    Smart Contract
                                </Badge>
                            </div>
                            <CardDescription className="text-blue-100">
                                Contract Address:
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <button
                                                onClick={() => copyToClipboard(contractData.address)}
                                                className="ml-2 text-white font-mono text-xs hover:underline"
                                            >
                                                {contractData.address}
                                            </button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Click to copy</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </CardDescription>
                        </CardHeader>

                        <Tabs defaultValue="overview" className="w-full">
                            <div className="px-6 pt-6 border-b">
                                <TabsList className="bg-blue-100/60 w-full justify-start">
                                    <TabsTrigger
                                        value="overview"
                                        className="data-[state=active]:bg-white data-[state=active]:text-blue-700 rounded-t-lg border-b-0"
                                    >
                                        Overview
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="bytecode"
                                        className="data-[state=active]:bg-white data-[state=active]:text-blue-700 rounded-t-lg border-b-0"
                                    >
                                        Bytecode
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="storage"
                                        className="data-[state=active]:bg-white data-[state=active]:text-blue-700 rounded-t-lg border-b-0"
                                    >
                                        Storage
                                    </TabsTrigger>
                                </TabsList>
                            </div>

                            <TabsContent value="overview" className="p-0 m-0">
                                <CardContent className="pt-6 space-y-6">
                                    {/* Contract Info */}
                                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                                        <h3 className="font-medium text-blue-800 mb-4">Contract Overview</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <div className="font-medium text-sm text-blue-900">Contract Address</div>
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <button
                                                                onClick={() => copyToClipboard(contractData.address)}
                                                                className="w-full text-left px-3 py-2 bg-white rounded-lg border border-blue-200 text-sm font-mono truncate block hover:bg-blue-50"
                                                            >
                                                                {contractData.address}
                                                            </button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Click to copy address</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </div>

                                            <div>
                                                <div className="font-medium text-sm text-blue-900">Contract Balance</div>
                                                <div className="px-3 py-2 bg-white rounded-lg border border-blue-200 text-sm flex items-center">
                                                    <Coins className="h-4 w-4 mr-2 text-blue-600" />
                                                    <span className="font-medium">
                                                        {(fromHex(contractData.balance) / 1e18).toFixed(6)} ETH
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Contract Details */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
                                            <div className="flex items-center gap-3 mb-1">
                                                <FileCode className="h-5 w-5 text-blue-600" />
                                                <h3 className="font-medium text-blue-800">Bytecode Size</h3>
                                            </div>
                                            <div className="text-2xl font-bold text-blue-700 mt-2">
                                                {contractData.bytecodeSize.toLocaleString()} bytes
                                            </div>
                                            <div className="text-sm text-blue-600 mt-1">
                                                {contractData.bytecodeSize > 24000 ? 'Large contract (>24KB)' : 'Standard size contract'}
                                            </div>
                                        </div>

                                        <div className="rounded-lg border border-indigo-100 bg-indigo-50 p-4">
                                            <div className="flex items-center gap-3 mb-1">
                                                <Settings className="h-5 w-5 text-indigo-600" />
                                                <h3 className="font-medium text-indigo-800">Storage Usage</h3>
                                            </div>
                                            <div className="mt-2 space-y-1">
                                                <div className="flex justify-between">
                                                    <span className="text-indigo-700">Storage Slot 0:</span>
                                                    <span className="font-mono">
                                                        {contractData.storage && contractData.storage !== '0x0' ?
                                                            contractData.storage :
                                                            '0x0 (Empty)'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Contract Functions */}
                                    <div>
                                        <h3 className="font-medium text-blue-800 mb-2">Contract Functions</h3>
                                        <div className="bg-white rounded-lg border border-blue-100 p-4">
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button variant="outline" className="w-full bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100">
                                                        <Code className="h-4 w-4 mr-2" />
                                                        View Contract ABI / Functions
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="max-w-lg">
                                                    <DialogHeader>
                                                        <DialogTitle>Contract Interface (ABI)</DialogTitle>
                                                        <DialogDescription>
                                                            Contract ABI data would be displayed here
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <div className="bg-gray-50 rounded p-3 text-xs font-mono h-64 overflow-y-auto">
                                                        <div className="text-gray-500 italic">
                                                            ABI data not available in this implementation.
                                                            This would require additional API calls to retrieve or verify contract ABIs.
                                                        </div>
                                                    </div>
                                                </DialogContent>
                                            </Dialog>
                                        </div>
                                    </div>
                                </CardContent>
                            </TabsContent>

                            <TabsContent value="bytecode" className="p-0 m-0">
                                <CardContent className="pt-6">
                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <h3 className="font-medium text-blue-800">Contract Bytecode</h3>
                                            <Badge className="bg-blue-100 text-blue-700">
                                                {contractData.bytecodeSize.toLocaleString()} bytes
                                            </Badge>
                                        </div>
                                        <div className="bg-gray-50 rounded-lg border border-gray-200 p-3">
                                            <pre className="overflow-x-auto text-xs font-mono whitespace-pre-wrap break-all max-h-96 overflow-y-auto">
                                                {formatContractCode(contractData.code)}
                                            </pre>
                                        </div>
                                        <div className="mt-2 text-xs text-gray-500">
                                            Note: Bytecode shown is the deployed (runtime) code, not including constructor logic.
                                        </div>
                                    </div>
                                </CardContent>
                            </TabsContent>

                            <TabsContent value="storage" className="p-0 m-0">
                                <CardContent className="pt-6">
                                    <div className="space-y-4">
                                        <div>
                                            <h3 className="font-medium text-blue-800 mb-2">Storage Slots</h3>
                                            <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                                                <Table>
                                                    <thead>
                                                        <tr>
                                                            <th className="w-1/4">Slot</th>
                                                            <th className="w-3/4">Value</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td className="font-mono text-sm">0x0</td>
                                                            <td className="font-mono text-sm break-all">
                                                                {contractData.storage || '0x0'}
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td colSpan={2} className="text-center text-gray-500 italic text-sm">
                                                                Additional storage slots would require multiple API calls to retrieve.
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </Table>
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="font-medium text-blue-800 mb-2">Storage Inspector</h3>
                                            <div className="flex gap-2">
                                                <Input
                                                    type="text"
                                                    placeholder="Enter storage slot (e.g., 0x1)"
                                                    className="flex-1 border-blue-200 focus:border-blue-400 focus:ring-blue-300"
                                                />
                                                <Button
                                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                                >
                                                    <Search className="h-4 w-4 mr-2" />
                                                    Query Slot
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </TabsContent>
                        </Tabs>

                        
                    </Card>
                )}
            </div>
        </div>
    )
}

export default BlockExplorer