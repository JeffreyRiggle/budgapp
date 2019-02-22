import React, {Component} from 'react';
import './HistoryGraph.scss';

const LineChart = require("react-chartjs").Line;
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

class HistoryGraph extends Component {
    constructor(props) {
        super(props);

        this.earnings = this.props.earnings;
        this.spending = this.props.spending;

        this.state = {
            data: this.getLineChartData()
        }
    }

    getLineChartData() {
        return {
            labels: this.spending.map(item => item.date),
            datasets: [
                {
                    label: 'Spending',
                    fillColor: 'rgba(220,0,0,0.4)',
			        strokeColor: 'rgba(220,0,0,1)',
			        pointColor: 'rgba(220,0,0,1)',
			        pointStrokeColor: '#fff',
			        pointHighlightFill: '#fff',
                    pointHighlightStroke: 'rgba(220,0,0,1)',
                    data: this.spending.map(item => item.amount)
                },
                {
                    label: 'Earning',
                    fillColor: 'rgba(0,220,0,0.2)',
			        strokeColor: 'rgba(0,220,0,1)',
			        pointColor: 'rgba(0,220,0,1)',
			        pointStrokeColor: '#fff',
			        pointHighlightFill: '#fff',
                    pointHighlightStroke: 'rgba(0,220,0,1)',
                    data: this.earnings
                }
            ]
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.earning === this.earnings && nextProps.spending === this.spending) {
            return;
        }

        this.earnings = nextProps.earning;
        this.spending = nextProps.spending;

        this.setState({
            data: this.getLineChartData()
        });
    }

    render() {
        return (
            <div className="history-graph">
                <LineChart data={this.state.data} options={options} />
            </div>
        )
    }
}

export default HistoryGraph;