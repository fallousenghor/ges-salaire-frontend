
import { useRef } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { usePayrollEvolution } from '../hooks/usePayrollEvolution';

ChartJS.register(ArcElement, Tooltip, Legend);



export function PayrollEvolutionChart() {
  const { data, loading, error } = usePayrollEvolution();
  const chartRef = useRef<ChartJS<'doughnut'>>(null);

  if (loading) return <div className="text-theme-secondary/40">Chargement du graphique...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  const chartData = {
    labels: data.map((d: { month: string }) => d.month),
    datasets: [
      {
        label: 'Masse salariale',
        data: data.map((d: { total: number }) => d.total),
        backgroundColor: [
          // Utiliser des variations de notre couleur primaire
          'rgba(var(--theme-primary-rgb), 1)',
          'rgba(var(--theme-primary-rgb), 0.8)',
          'rgba(var(--theme-primary-rgb), 0.6)',
          'rgba(var(--theme-primary-rgb), 0.4)',
          'rgba(var(--theme-primary-rgb), 0.2)',
          'rgba(var(--theme-primary-rgb), 0.1)',
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
          // Utiliser notre couleur secondaire
          color: 'rgba(var(--theme-secondary-rgb), 0.8)',
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
