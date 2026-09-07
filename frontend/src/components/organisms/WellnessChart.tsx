'use client';

import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Registro dos módulos do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface WellnessChartProps {
  title: string;
  labels: string[];
  dataValues: number[];
  labelName: string;
  borderColor?: string;
  backgroundColor?: string;
}

export const WellnessChart: React.FC<WellnessChartProps> = ({
  title,
  labels,
  dataValues,
  labelName,
  borderColor = 'rgba(13, 110, 253, 1)',
  backgroundColor = 'rgba(13, 110, 253, 0.1)',
}) => {
  const data = {
    labels,
    datasets: [
      {
        fill: true,
        label: labelName,
        data: dataValues,
        borderColor: borderColor,
        backgroundColor: backgroundColor,
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        display: false,
      },
      title: {
        display: false,
        text: title,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="card shadow-sm border-0 p-4 bg-white bg-opacity-75 h-100" style={{ backdropFilter: 'blur(10px)', borderRadius: '1rem' }}>
      <h5 className="fw-bold text-secondary mb-3">{title}</h5>
      <div className="chart-container" style={{ position: 'relative', width: '100%', height: '260px' }}>
        <Line data={data} options={options} />
      </div>
    </div>
  );
};