import React, { useState, useEffect } from "react";
import axios from "axios";
import "chartjs-plugin-datalabels";
import { Doughnut } from "react-chartjs-2";
import { css } from "@emotion/core";
import ClipLoader from "react-spinners/ClipLoader";
import "../style/Card.css";

const override = css`
  display: block;
  margin: 0 auto;
  border-color: #E47D1E;
`;

const convertToPercentage = (value, context) => {
  const total = context.dataset.data.reduce(
    (acc, curr) => acc + Number(curr),
    0
  );
  if (total === 0) {
    return "0 %";
  }
  return ((value / total) * 100).toFixed() + " %";
};

const options = {
  legend: {
    position: "bottom",
    labels: {
      fontSize: 16
    }
  },
  plugins: {
    datalabels: {
      color: "#FFFFFF",
      formatter: (value, context) => convertToPercentage(value, context),
      font: {
        size: 16
      }
    }
  },
  maintainAspectRatio: false,
  animation: {
    duration: 0
  }
};

function LocationChart() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    /* Set to null to display loader */
    setData(null);
    const res = await axios.get("http://localhost:8080/location");
    setData(res.data);
  };

  return (
    <div className="medium-card-container">
      <div className="medium-card-header">
        <span>Geography</span>
      </div>
      <div className="medium-card-body">
        {!data ? (
          <ClipLoader
            css={override}
            size={150}
            color={"#123abc"}
            loading={true}
          />
        ) : (
          <Doughnut data={data} options={options} style={{ height: "100%" }} />
        )}
      </div>
    </div>
  );
}

export default LocationChart;
