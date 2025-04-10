"use client"

import { useState, useEffect } from "react"
import { PROCESSED_DATA_URL } from '../../../../config';

const useFetchData = () => {
  const [data, setData] = useState(null)
  const [timer, setTimer] = useState(15)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchData()
    const fetchInterval = setInterval(fetchData, 15000)
    const countdownInterval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 15))
    }, 1000)

    return () => {
      clearInterval(fetchInterval)
      clearInterval(countdownInterval)
    }
  }, [])

  const fetchData = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(PROCESSED_DATA_URL, { cache: "no-store" })
      if (!response.ok) throw new Error("Failed to fetch")
      const jsonData = await response.json()
      setData(jsonData.data)
      setTimer(15)
    } catch (error) {
      console.error("Error fetching data:", error)
      setData(null)
    } finally {
      setIsLoading(false)
    }
  }

  return { data, isLoading, timer, fetchData }
}

export default useFetchData

