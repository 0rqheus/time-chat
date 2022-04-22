import React from "react";
import { PieChart, Pie, Tooltip, Cell } from "recharts";

const Chart = ({ item }) => {
    
    const COLORS = ["#ff9900", "#00cc00", "#0066ff", "#ffff00", "#00ccff", "#9933ff", "#ff3300"];
    const data = item.answers.map(answer => ({
        name: answer.variant, value: answer.votes
    }));

    return (
        <PieChart width={400} height={400} className="result__chart">
            <Pie
                dataKey="value"
                data={data}
                cx={200}
                cy={200}
                outerRadius={80}
                fill="#82ca9d"
                label
            >
                {
                    data.map((item, index) => <Cell key={item.name} fill={COLORS[index % COLORS.length]} />)
                }
            </Pie>
            <Tooltip />
        </PieChart>
    );
};

export default Chart;