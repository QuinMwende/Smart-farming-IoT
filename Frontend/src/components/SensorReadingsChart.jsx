import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { sensorAPI, handleApiError } from '../services/api';
import './SensorReadingsChart.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const SensorReadingsChart = ({ sensors, days = 7 }) => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReadings = async () => {
      if (!sensors || sensors.length === 0) {
        setChartData(null);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch readings for all sensors
        const readingsMap = {};
        for (const sensor of sensors) {
          try {
            const response = await sensorAPI.getReadings(sensor.id, days);
            const data = response.data || [];
            console.log(`Sensor ${sensor.id} (${sensor.type}):`, data.length, 'readings');
            readingsMap[sensor.id] = data;
          } catch (err) {
            console.warn(`No readings for sensor ${sensor.id}:`, err);
            readingsMap[sensor.id] = [];
          }
        }

        // Prepare chart data
        const datasets = sensors.map((sensor) => {
          const readings = readingsMap[sensor.id] || [];
          const sensorReadings = readings
            .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
            .map(r => ({
              timestamp: new Date(r.timestamp),
              value: r.readingValue,
            }));

          const colors = {
            temperature: '#FF6384',
            humidity: '#36A2EB',
            pressure: '#FFCE56',
            soil_moisture: '#4BC0C0',
            wind_speed: '#9966FF',
          };

          const borderColor = colors[sensor.type] || '#999';

          return {
            label: `${sensor.type} (${sensor.location})`,
            data: sensorReadings.map(r => r.value),
            borderColor,
            backgroundColor: borderColor + '20',
            borderWidth: 2,
            tension: 0.4,
            fill: true,
            pointRadius: 2,
            pointHoverRadius: 4,
            pointBackgroundColor: borderColor,
            pointBorderColor: '#fff',
            pointBorderWidth: 1,
          };
        });

        const labels = sensors.length > 0 && readingsMap[sensors[0].id]
          ? readingsMap[sensors[0].id]
              .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
              .map(r => new Date(r.timestamp).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              }))
          : [];

        if (datasets.length > 0 && labels.length > 0) {
          setChartData({
            labels,
            datasets,
          });
        } else {
          setChartData(null);
        }
      } catch (err) {
        console.error('Error fetching sensor readings:', err);
        setError(handleApiError(err));
        setChartData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchReadings();
  }, [sensors, days]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          boxWidth: 12,
          padding: 15,
          font: {
            size: 12,
            weight: 'bold',
          },
        },
      },
      title: {
        display: true,
        text: `Sensor Readings (Last ${days} days)`,
        font: {
          size: 14,
          weight: 'bold',
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: { size: 12, weight: 'bold' },
        bodyFont: { size: 11 },
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${context.parsed.y.toFixed(2)}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Value',
        },
        grid: {
          color: 'rgba(200, 200, 200, 0.2)',
        },
      },
      x: {
        grid: {
          color: 'rgba(200, 200, 200, 0.2)',
        },
      },
    },
  };

  if (loading) {
    return <div className="sensor-chart-loading">Loading sensor data...</div>;
  }

  if (error) {
    return <div className="sensor-chart-error">Error loading data: {error}</div>;
  }

  if (!chartData) {
    return (
      <div className="sensor-chart-empty">
        <p>📊 No sensor readings yet! Add a sensors to the farm first</p>
        
      </div>
    );
  }

  return (
    <div className="sensor-readings-chart-container">
      <Line data={chartData} options={chartOptions} />
    </div>
  );
};

export default SensorReadingsChart;
