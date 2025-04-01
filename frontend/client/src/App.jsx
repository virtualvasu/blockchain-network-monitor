"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./components/ui/tabs"
import { Button } from "./components/ui/button"
import { Database, RefreshCw } from "lucide-react"
import Dashboard from "./components/dashboard/Dashboard"
import Performance from "./components/dashboard/Performance"
import NetworkHealth from "./components/dashboard/NetworkHealth"
import LoadingState from "./components/dashboard/LoadingState"
import useFetchData from "./hooks/useFetchData"
import "./App.css"

const App = () => {
  const { data, isLoading, timer, fetchData } = useFetchData()
  const [activeTab, setActiveTab] = useState("dashboard")

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-purple-900 mb-2">Blockchain Performance Monitor</h1>
          <p className="text-purple-600 mb-4">Real-time analytics and monitoring dashboard</p>

          <div className="flex items-center justify-center gap-4 text-sm">
            <div className="bg-white px-3 py-1 rounded-full border border-purple-200 shadow-sm flex items-center">
              <Database className="h-4 w-4 text-purple-500 mr-1" />
              <span className="text-purple-800">Chain ID: {data ? data.history.at(-1).network.chainId : "..."}</span>
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

        <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
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
          Built with ❤️ and data by <strong>Vasu</strong>
        </div>
      </div>
    </div>
  )
}

export default App

