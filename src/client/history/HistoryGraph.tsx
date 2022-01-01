import React from 'react';
import './HistoryGraph.scss';
import { HistoryItem } from './HistoryView';

const LineChart = require("react-chartjs").Line;
interface HistoryGraphProps {
    earning: HistoryItem[];
    spending: HistoryItem[];
}

const options = {
    responsive: true,
    title: {
        display: true,
        text: 'Spending vs Earning'
    },
    scales: {
        xAxes: [{
            display: true,
        }],
        yAxes: [{
            display: true,
            type: 'logarithmic',
        }]
    }
};

const HistoryGraph = (props: HistoryGraphProps) => {
    const { earning, spending } = props;
    const data = {
        labels: spending.map(item => item.date),
        datasets: [
            {
                label: 'Spending',
                fillColor: 'rgba(220,0,0,0.4)',
                strokeColor: 'rgba(220,0,0,1)',
                pointColor: 'rgba(220,0,0,1)',
                pointStrokeColor: '#fff',
                pointHighlightFill: '#fff',
                pointHighlightStroke: 'rgba(220,0,0,1)',
                data: spending.map(item => item.amount) || []
            },
            {
                label: 'Earning',
                fillColor: 'rgba(0,220,0,0.2)',
                strokeColor: 'rgba(0,220,0,1)',
                pointColor: 'rgba(0,220,0,1)',
                pointStrokeColor: '#fff',
                pointHighlightFill: '#fff',
                pointHighlightStroke: 'rgba(0,220,0,1)',
                data: earning.map(item => item.amount) || []
            }
        ]
    };

    return (
        <div className="history-graph">
            <LineChart data={data} options={options} />
        </div>
    );
}

export default HistoryGraph;