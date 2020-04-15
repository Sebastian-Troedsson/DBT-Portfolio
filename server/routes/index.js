const express = require("express");
const router = express.Router();
const {
  calcLocationChart,
  calcProductTypeChart,
  calcAmortizationChart,
  calcLatePaymentsChart,
} = require("../graphCalculators");
const {
  locationDataQuery,
  productTypeDataQuery,
  amortizationDataQuery,
  totalOBQuery,
  totalLoansAmountQuery,
  lateDaysDataQuery,
  totalInterestDataQuery,
  orgDataQuery,
  contractIDQuery
} = require("../db/queries");
const pool = require("../db");

router.get("/location", async (req, res) => {
  const date = new Date().toISOString().split('T')[0];
  const DBdata = await pool.query(locationDataQuery(date));
  const data = calcLocationChart(DBdata.rows);
  res.json(data);
});

router.get("/productType", async (req, res) => {
  const date = new Date().toISOString().split('T')[0];
  const DBdata = await pool.query(productTypeDataQuery(date));
  const data = calcProductTypeChart(DBdata.rows);
  res.json(data);
});

router.post("/amortization", async (req, res) => {
  const date = req.body.date;
  const DBdata = await pool.query(amortizationDataQuery(date));
  const data = calcAmortizationChart(DBdata.rows);
  res.json(data);
});

router.get("/totalob", async (req, res) => {
  const DBdata = await pool.query(totalOBQuery());
  res.json(Number(DBdata.rows[0].sum).toFixed());
});

router.get("/paidback", async (req, res) => {
  const totalOB = await pool.query(totalOBQuery());
  const totalLoan = await pool.query(totalLoansAmountQuery());
  res.json(
    (Number(totalLoan.rows[0].sum) - Number(totalOB.rows[0].sum))
      .toFixed()
      .toString()
  );
});

router.post("/latepayments", async (req, res) => {
  const date = req.body.date;
  const lateDays = await pool.query(lateDaysDataQuery(date));
  const totalOB = await pool.query(totalOBQuery());
  const data = calcLatePaymentsChart(lateDays.rows, totalOB.rows[0].sum, date);
  res.json(data);
});

router.get("/totalinterest", async (req, res) => {
  const totalInterest = await pool.query(totalInterestDataQuery());
  res.json(parseInt(totalInterest.rows[0].sum).toString());
});

router.post("/contracts", async (req, res) => {
  const paymentDueOn = req.body.data.paymentDueOn;
  const dueAmount = req.body.data.dueAmount;
  const organisationName = req.body.data.organisationName;
  const contractId = await pool.query(contractIDQuery(paymentDueOn, dueAmount, organisationName));
  const contractInformation = await pool.query(orgDataQuery(contractId.rows[0].contract_id));
  res.json(contractInformation.rows[0]);
});

router.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

module.exports = router;
