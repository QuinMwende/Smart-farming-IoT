import React, { useEffect, useState } from 'react';
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
import { readingAPI, handleApiError } from '../services/api';
import './SensorChart.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const SensorChart = ({ farmId, days = 7 }) => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReadings = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await readingAPI.getReadings(farmId, days);
        const readings = response.data;

        if (readings.length === 0) {
          setChartData(null);
          setError('No sensor readings available yet.');
          return;
        }

        // Group by sensor type
        const grouped = {};
        readings.forEach((reading) => {
          const sensorType = reading.sensor?.type || 'Unknown';
          if (!grouped[sensorType]) grouped[sensorType] = [];
          grouped[sensorType].push(reading);
        });

        // Prepare chart data
        const colors = {
          temperature: 'rgb(255, 99, 132)',
          soil_moisture: 'rgb(54, 162, 235)',
          humidity: 'rgb(75, 192, 192)',
        };

        const datasets = Object.entries(grouped).map(([sensorType, data]) => {
          const sorted = data.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
          return {
            label: sensorType.replace('_', ' ').toUpperCase(),
            data: sorted.map((r) => r.readingValue),
            borderColor: colors[sensorType] || 'rgb(200, 200, 200)',
            backgroundColor: (colors[sensorType] || 'rgb(200, 200, 200)') + '20',
            tension: 0.4,
            fill: true,
          };
        });

        const labels = readings
          .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
          .slice(0, 10)
          .map((r) => new Date(r.timestamp).toLocaleString());

        setChartData({
          labels,
          datasets,
        });
      } catch (err) {
        setError(handleApiError(err));
      } finally {
        setLoading(false);
      }
    };

    if (farmId) {
      fetchReadings();
    }
  }, [farmId, days]);

  if (loading) return <div className="sensor-chart loading">Loading chart...</div>;
  if (error) return <div className="sensor-chart error">Error: {error}</div>;
  if (!chartData) return <div className="sensor-chart empty">No data to display</div>;

  return (
    <div className="sensor-chart">
      <h3>Sensor Readings (Last {days} days)</h3>
      <Line
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            legend: { position: 'top' },
            title: { display: false },
          },
          scales: {
            y: { beginAtZero: true },
          },
        }}
      />
    </div>
  );
};

export default SensorChart;
