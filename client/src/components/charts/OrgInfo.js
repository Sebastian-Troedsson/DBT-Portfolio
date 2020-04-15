import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdHighlightOff } from "react-icons/md";
import { css } from "@emotion/core";
import ClipLoader from "react-spinners/ClipLoader";

const override = css`
  display: block;
  margin: 0 auto;
  margin-top: 15%;
  border-color: #e47d1e;
`;

function OrgInfo({ data, setModalIsOpen }) {
  const [org, setOrg] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await axios.post("http://localhost:8080/contracts", { data });
    setOrg(res.data);
    setIsLoading(false);
  };

  function getDate() {
    const startDate = new Date(org.contract_date);
    const endDate = new Date(org.maturity_date);
    return `${startDate.toISOString().split("T")[0]} - ${
      endDate.toISOString().split("T")[0]
    }`;
  }

  return (
    <div className="modal-card">
      {isLoading ? (
        <ClipLoader
          css={override}
          size={150}
          color={"#123abc"}
          loading={true}
        />
      ) : (
        <>
          <MdHighlightOff
            className="modal-button"
            onClick={() => setModalIsOpen(false)}
          />
          <div className="card-holder">
            <table>
              <caption>
                <h2>General Info</h2>
              </caption>
              <tbody>
                <tr>
                  <th scope="row" colspan="2">
                    Contract ID:
                  </th>
                  <td colspan="2">{org.contract_id}</td>
                </tr>
                <tr>
                  <th scope="row" colspan="2">
                    Organisation Name:
                  </th>
                  <td colspan="2">{org.organisation_name}</td>
                </tr>
                <tr>
                  <th scope="row" colspan="2">
                    Organisation City:
                  </th>
                  <td colspan="2">{org.org_city}</td>
                </tr>
                <tr>
                  <th scope="row" colspan="2">
                    Contract Length:
                  </th>
                  <td colspan="2">
                    <small>{getDate()}</small>
                  </td>
                </tr>
              </tbody>
            </table>

            <table>
              <caption>
                <h2>Loan Info</h2>
              </caption>
              <tr>
                <th scope="row" colspan="2">
                  Loan Size:
                </th>
                <td colspan="2">{Number(org.loan_size).toFixed(2)}</td>
              </tr>
              <tr>
                <th scope="row" colspan="2">
                  Loan Type:
                </th>
                <td colspan="2">{org.char_user_field2}</td>
              </tr>
              <tr>
                <th scope="row" colspan="2">
                  Outstanding Balance:
                </th>
                <td colspan="2">{Number(org.ob).toFixed(2)}</td>
              </tr>
              <tr>
                <th scope="row" colspan="2">
                  Repaid Amount:
                </th>
                <td colspan="2">{Number(org.loan_size - org.ob).toFixed(2)}</td>
              </tr>
              <tr>
                <th scope="row" colspan="2">
                  Interest Rate:
                </th>
                <td colspan="2">{org.interest_rate}</td>
              </tr>
            </table>
          </div>  
        </>
      )}
    </div>
  );
}

export default OrgInfo;
