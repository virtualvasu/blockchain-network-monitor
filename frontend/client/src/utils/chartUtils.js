import Chart from "chart.js/auto"

// Custom chart theme configuration
Chart.defaults.color = "#a78bfa"
Chart.defaults.borderColor = "#4c1d95"
Chart.defaults.font.family = "Inter, sans-serif"

export const plotHistoryGraph = (ref, label, xData, yData, borderColor, backgroundColor, charts) => {
  if (ref.current) {
    const ctx = ref.current.getContext("2d")
    if (charts.current[label]) charts.current[label].destroy()

    charts.current[label] = new Chart(ctx, {
      type: "line",
      data: {
        labels: xData,
        datasets: [
          {
            label,
            data: yData,
            borderColor,
            backgroundColor,
            borderWidth: 2,
            tension: 0.4,
            pointBackgroundColor: borderColor,
            pointBorderColor: "#fff",
            pointRadius: 4,
            pointHoverRadius: 6,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: "top",
            labels: {
              boxWidth: 10,
              usePointStyle: true,
              font: {
                size: 12,
                weight: "bold",
              },
            },
          },
          tooltip: {
            backgroundColor: "#4c1d95",
            titleColor: "#fff",
            bodyColor: "#e9d5ff",
            borderColor: "#8b5cf6",
            borderWidth: 1,
            padding: 10,
            displayColors: false,
            callbacks: {
              title: (tooltipItems) => `Block #${tooltipItems[0].label}`,
            },
          },
        },
        scales: {
          y: {
            grid: {
              color: "rgba(156, 163, 175, 0.15)",
            },
            ticks: {
              padding: 10,
            },
          },
          x: {
            grid: {
              display: false,
            },
            ticks: {
              maxRotation: 0,
              maxTicksLimit: 8,
              padding: 10,
            },
          },
        },
        animation: {
          duration: 2000,
          easing: "easeOutQuart",
        },
      },
    })
  }
}

export const getHealthColor = (score) => {
  if (score >= 80) return "text-green-500"
  if (score >= 60) return "text-yellow-500"
  return "text-red-500"
}

export const getChangeIndicator = (current, previous) => {
  if (!previous) return null
  const isIncrease = current > previous
  const color = isIncrease ? "text-green-500" : "text-red-500"
  const Icon = isIncrease ? "ArrowUpCircle" : "ArrowUpCircle"
  return {
    color,
    isIncrease,
    Icon,
  }
}

