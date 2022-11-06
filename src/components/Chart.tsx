import {
  CategoryScale, Chart as ChartJS, Filler, LinearScale, LineController, LineElement, PointElement,
  Tooltip, TooltipItem, TooltipLabelStyle,
} from 'chart.js';
import { Chart as ReactChart } from 'react-chartjs-2';

import { Box, useMantineTheme } from '@mantine/core';

interface ChartProps {
  labels: (string | number)[];
  data: number[];
  height?: number;
}

ChartJS.register(
  CategoryScale,
  Filler,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Tooltip,
);

function Chart({ labels, data, height = 250 }: ChartProps) {
  const theme = useMantineTheme();
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const gradient = ctx?.createLinearGradient(0, 0, 0, 200);
  const ticks = {
    precision: 0,
    autoSkip: true,
    font: { family: theme.fontFamily },
    color: theme.colors.dark[theme.colorScheme === 'dark' ? 1 : 4],
  };

  gradient?.addColorStop(0, theme.colors[theme.primaryColor][9]);
  gradient?.addColorStop(1, 'transparent');

  return (
    <Box sx={{ height, width: '100%' }}>
      <ReactChart
        type="line"
        options={{
          responsive: true,
          maintainAspectRatio: false,
          interaction: {
            intersect: false,
            mode: 'index',
          },
          scales: {
            x: {
              axis: 'x',
              ticks: {
                ...ticks,
                autoSkipPadding: 20,
              },
              grid: { display: false },
            },
            y: {
              axis: 'y',
              ticks: {
                ...ticks,
                autoSkipPadding: 50,
              },
              grid: { display: false },
              beginAtZero: true,
            },
          },
          plugins: {
            tooltip: {
              padding: theme.spacing.sm,
              titleFont: { family: theme.fontFamily },
              bodyFont: { family: theme.fontFamily },
              backgroundColor: theme.colors.dark[5],
              titleColor: 'white',
              bodyColor: theme.colors.dark[0],
              cornerRadius: theme.radius.sm,
              callbacks: {
                labelColor: (tooltipItem: TooltipItem<'line'>) => {
                  const { borderColor } = tooltipItem.dataset;
                  return {
                    backgroundColor: borderColor,
                    borderColor,
                    borderRadius: theme.radius.sm,
                  } as TooltipLabelStyle;
                },
              },
            },
          },
        }}
        data={{
          labels,
          datasets: [
            {
              data,
              fill: true,
              borderColor: theme.colors[theme.primaryColor][5],
              backgroundColor: gradient,
              borderWidth: 2,
              pointStyle: 'circle',
              pointRadius: 0,
              pointHoverRadius: 6,
              hoverBorderWidth: 2,
              tension: 0.4,
            },
          ],
        }}
      />
    </Box>
  );
}

export default Chart;
