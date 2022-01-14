import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Category } from '../../common/category';
import { Chart, ArcElement } from 'chart.js';

Chart.register(ArcElement);

const options = {
    responsive: true,
    maintainAspectRatio: false,
    legend: {
        display: false,
    },
};

interface CategoryChartProps {
    categories: Category[];
}

function generateColorSegment(startingPoint: number): number {
    const offset = Math.floor(Math.random() * 100);

    if (offset + startingPoint > 255) {
        return startingPoint - offset;
    }

    return offset + startingPoint;
}

function generateColor(seed: number): string {
    if (seed % 2 === 1) {
        return `rgb(${generateColorSegment(0)}, ${generateColorSegment(0)}, ${generateColorSegment(255)})`;
    }

    return `rgb(${generateColorSegment(255)}, ${generateColorSegment(255)}, ${generateColorSegment(0)})`;
}

function generateRandomColors(count: number): string[] {
    const retVal: string[] = [];
    for (let i = 0; i < count; i++) {
        retVal.push(generateColor(i));
    }
    return retVal;
}

export const CategoryChart = (props: CategoryChartProps) => {
    const { categories } = props;
    const [colors, setColors] = React.useState<string[]>([]);

    React.useEffect(() => {
        setColors(generateRandomColors(categories.length))
    }, [categories.length]);

    const data = {
        labels: categories.map(item => item.name),
        datasets: [{
            data: categories.map(item => item.allocated),
            backgroundColor: colors,
        }]
    };

    return (
        <div className="category-chart">
            <Pie data={data} options={options} />
        </div>
    );
}

export default React.memo(CategoryChart);