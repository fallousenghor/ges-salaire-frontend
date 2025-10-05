
import { useRef } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { usePayrollEvolution } from '../hooks/usePayrollEvolution';

ChartJS.register(ArcElement, Tooltip, Legend);



export function PayrollEvolutionChart() {
  const { data, loading, error } = usePayrollEvolution();
  const chartRef = useRef<ChartJS<'doughnut'>>(null);

  if (loading) return <div className="text-gray-400">Chargement du graphique...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  const chartData = {
    labels: data.map((d: { month: string }) => d.month),
    datasets: [
      {
        label: 'Masse salariale',
        data: data.map((d: { total: number }) => d.total),
        backgroundColor: [
          '#34d399',
          '#6ee7b7',
          '#059669',
          '#a7f3d0',
          '#10b981',
          '#064e3b',
        ],
        borderColor: '#fff',
        borderWidth: 2,
        hoverOffset: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom' as const,
        labels: {
          color: '#059669',
          font: { size: 14, weight: 'bold' as const },
        },
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem: import('chart.js').TooltipItem<'doughnut'>) => {
            const label = tooltipItem.label || '';
            const value = tooltipItem.parsed !== undefined ? tooltipItem.parsed : '';
            return label + ': ' + value.toLocaleString() + ' FCFA';
          },
        },
      },
    },
    animation: {
      duration: 1200,
    },
    cutout: '60%',
  };

  return (
    <div className="w-full h-[260px] bg-white rounded-xl shadow-md p-4 border border-gray-100">
      <Doughnut ref={chartRef} data={chartData} options={chartOptions} />
    </div>
  );
}
