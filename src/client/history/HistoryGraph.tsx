import React from 'react';
import { HistoryItem } from './HistoryView';
import { Line } from 'react-chartjs-2';
import {
    Chart,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';

Chart.register(CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Filler,
    Title,
    Tooltip,
    Legend
);

interface HistoryGraphProps {
    earning: HistoryItem[];
    spending: HistoryItem[];
}

const options = {
    responsive: true,
    scales: {
        x: {
            display: true,
            title: {
                display: true,
                text: 'Month',
            },
        },
        y: {
            display: true,
            title: {
                display: true,
                text: 'Amount',
            },
        },
    },
};

const HistoryGraph = (props: HistoryGraphProps) => {
    const { earning, spending } = props;
    const data = {
        labels: spending.map(item => item.date),
        datasets: [
            {
                label: 'Earning',
                borderColor: 'rgba(0,220,0,1)',
                backgroundColor: 'rgba(0,220,0,0.2)',
                pointBorderColor: '#fff',
                pointBackgroundColor: 'rgba(0,220,0,1)',
                pointHoverBorderColor: 'rgba(0,220,0,1)',
                pointHoverBackgroundColor: '#fff',
                fill: true,
                tension: .1,
                data: earning.map(item => item.amount / 100) || [],
            },
            {
                label: 'Spending',
                borderColor: 'rgba(220,0,0,1)',
                backgroundColor: 'rgba(220,0,0,0.4)',
                pointBorderColor: '#fff',
                pointBackgroundColor: 'rgba(220,0,0,1)',
                pointHoverBorderColor: 'rgba(220,0,0,1)',
                pointHoverBackgroundColor: '#fff',
                fill: true,
                tension: .1,
                data: spending.map(item => item.amount / 100) || []
            },
        ]
    };

    return (
        <div>
            <Line data={data} options={options} />
        </div>
    );
}

export default HistoryGraph;