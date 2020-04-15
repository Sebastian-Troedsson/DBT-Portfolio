import React, { useEffect, useState } from "react";
import axios from "axios";
import { css } from "@emotion/core";
import ClipLoader from "react-spinners/ClipLoader";

const override = css`
  height: 50px;
  width: 50px;
  margin: 0 auto;
  border-color: #e47d1e;
`;

function TotalObCard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setData(null);
    const res = await axios.get("http://localhost:8080/totalob");
    setData(res.data);
  };

  const formatter = (data) => data.split('').reverse().map((number, i) => (i + 1) % 3 === 0 ? ' ' + number : number).reverse().join('');

  return (
    <div className="small-card-container bg-purple">
      <div className="small-card-header">
        <span>Outstanding Balance</span>
      </div>
      <div className="small-card-body">
      {!data ? <ClipLoader
            css={override}
            size={150}
            color={"#123abc"}
            loading={true}
          /> : <span>{formatter(data)} SEK</span>}
      </div>
    </div>
  );
}

export default TotalObCard;
