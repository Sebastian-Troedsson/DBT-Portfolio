import React, { useState, useEffect } from "react";
import axios from "axios";
import "chartjs-plugin-datalabels";
import "chartjs-plugin-colorschemes";
import "../style/Card.css";
import { DatePicker } from "@material-ui/pickers";
import { Bar } from "react-chartjs-2";
import { css } from "@emotion/core";
import ClipLoader from "react-spinners/ClipLoader";
import Modal from "react-modal";
import OrgInfo from './OrgInfo';
import '../style/Modal.css';

const customStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  content: {
    position: 'absolute',
    top: '140px',
    left: '300px',
    right: '300px',
    bottom: '200px',
    border: '1px solid #7850A9',
    background: 'rgb(28, 29, 46, 0.99)',
    overflow: 'auto',
    WebkitOverflowScrolling: 'touch',
    borderRadius: '4px',
    outline: 'none',
    padding: '20px'
  }
};

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
          fontColor: "#fff",
        },
        ticks: {
          fontColor: "#9A9A9A",
        },
        gridLines: {
          display: false,
          color: "rgb(25, 27, 41)",
        },
      },
    ],
    yAxes: [
      {
        stacked: true,
        scaleLabel: {
          display: true,
          labelString: "Amount in SEK",
          fontColor: "#fff",
        },
        ticks: {
          fontColor: "#9A9A9A",
        },
        gridLines: {
          color: "rgb(25, 27, 41)",
        },
      },
    ],
  },
  plugins: {
    datalabels: {
      display: false,
    },
  },
  legend: {
    display: false,
  },
  maintainAspectRatio: false,
  animation: {
    duration: 0,
  },
};

function AmortizationChart() {
  const [data, setData] = useState(null);
  const [date, setDate] = useState(new Date());
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentOrg, setCurrentOrg] = useState(null);

  useEffect(() => {
    fetchData();
  }, [date]);

  const fetchData = async () => {
    /* Set to null to display loader */
    setData(null);
    const res = await axios.post("http://localhost:8080/amortization", {
      date,
    });
    setData(res.data);
  };

  const optionsWithOnClick = {
    ...options,
    onClick: function (e) {
      if (this.getElementAtEvent(e).length > 0) {
        const organisationName = this.getElementAtEvent(e)[0]._model.datasetLabel;
        const paymentDueOn = this.getElementAtEvent(e)[0]._model.label;
        const datasetIndex = this.getElementAtEvent(e)[0]._datasetIndex;
        const index = this.getElementAtEvent(e)[0]._index;
        const dueAmount = data.datasets[datasetIndex].data[index].substring(1);
        setCurrentOrg({
          organisationName,
          paymentDueOn,
          dueAmount
        });
        setModalIsOpen(true);
      }
    },
  };

  return (
    <div className="large-card-container">
      <div className="large-card-header">
        <span>Future Payments</span>
        <DatePicker
          value={date}
          onChange={(date) => setDate(date.toISOString().split("T")[0])}
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
            <>
              <Bar data={data} options={optionsWithOnClick} style={{ height: "100%" }} />
              <div>
                <Modal
                  isOpen={modalIsOpen}
                  style={customStyles}
                  
                >
                  <OrgInfo data={currentOrg} setModalIsOpen={setModalIsOpen}/>
                </Modal>
              </div>
            </>
          )}
      </div>
    </div>
  );
}

export default AmortizationChart;
