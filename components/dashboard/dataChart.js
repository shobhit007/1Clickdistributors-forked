import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import { cellColors } from "@/lib/data/commonData";

Chart.register(ArcElement, Tooltip, Legend);

const DataChart = ({ stats }) => {
  // Filter out zero values and convert the object into labels and data arrays

  console.log("stats is", stats);
  const labels = Object.keys(stats || {}).map(
    (item) => `${item}-${stats[item]}`
  );
  const dataValues = labels.map((key) => {
    let label = key.split("-")[0];
    return stats[label];
  });

  const data = {
    labels,
    datasets: [
      {
        label: "User Data",
        data: dataValues,
        backgroundColor: Object.keys(stats || {}).map(
          (item) => cellColors[item] || "#FF6384"
        ),
        hoverBackgroundColor: ["#efef4d"],
      },
    ],
  };

  const options = {
    // centerText: {
    //   display: true,
    //   text: `90%`,
    // },

    maintainAspectRatio: false,
    // rotation: -90,
    // circumference: 180,
    // cutout: "85%",
    plugins: {
      legend: true, // Hide legend
    },
  };

  return <Doughnut data={data} options={options} />;
};

export default DataChart;
