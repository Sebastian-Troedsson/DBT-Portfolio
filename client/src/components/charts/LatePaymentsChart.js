import React, { useState, useEffect } from "react";
import axios from "axios";
import "chartjs-plugin-datalabels";
import "chartjs-plugin-colorschemes";
import "../style/Card.css";
import { DatePicker } from "@material-ui/pickers";
import { Bar } from "react-chartjs-2";
import { css } from "@emotion/core";
import ClipLoader from "react-spinners/ClipLoader";

const override = css`
  display: block;
  margin: 0 auto;
  border-color: #e47d1e;
`;

const options = {
  scales: {
    xAxes: [
      {
        stacked: true,
        scaleLabel: {
          display: true,    
          labelString: 'Days',
          fontColor: "#fff"
        },
        barPercentage: 0.5,
        ticks: {
          fontColor: "#9A9A9A"
        },
        gridLines: {
          display: false,
          color: "rgb(25, 27, 41)"
        }
      }
    ],
    yAxes: [
      {
        stacked: true,
        scaleLabel: {
          display: true,
          labelString: "%",
          fontColor: "#fff"
        },
        ticks: {
          fontColor: "#9A9A9A"
        },
        gridLines: {
          color: "rgb(25, 27, 41)"
        }
      }
    ]
  },
  plugins: {
    datalabels: {
      display: false
    }
  },
  legend: {
    display: false
  },
  maintainAspectRatio: false,
  animation: {
    duration: 0
  }
};

function LatePaymentChart() {
  const [data, setData] = useState(null);
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    fetchData();
  }, [date]);

  const fetchData = async () => {
    /* Set to null to display loader */
    setData(null);
    const res = await axios.post("http://localhost:8080/latepayments", { date });
    setData(res.data);
  };

  return (
    <div className="large-card-container">
      <div className="large-card-header">
        <span>Late Payments</span>
        <DatePicker
        value={date}
        onChange={date => setDate(date.toISOString().split('T')[0])}
        format="yyyy-MM-dd"
       />
      </div>
      <div className="large-card-body">
        {!data ? (
          <ClipLoader
            css={override}
            size={150}
            color={"#123abc"}
            loading={true}
          />
        ) : (
          <Bar data={data} options={options} style={{ height: "100%" }} />
        )}
      </div>
    </div>
  );
}

export default LatePaymentChart;
