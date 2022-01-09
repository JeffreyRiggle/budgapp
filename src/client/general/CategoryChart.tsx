import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Category } from '../../common/category';
import { Chart, ArcElement } from 'chart.js';

Chart.register(ArcElement);

interface CategoryChartProps {
    categories: Category[];
}

function generateColor(): number {
    return Math.floor(Math.random() * 255);
}

function generateRandomColors(count: number): string[] {
    const retVal: string[] = [];
    for (let i = 0; i < count; i++) {
        retVal.push(`rgb(${generateColor()}, ${generateColor()}, ${generateColor()})`)
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
            <Pie data={data} />
        </div>
    );
}

export default React.memo(CategoryChart);