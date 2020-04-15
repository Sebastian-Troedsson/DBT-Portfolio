const locationDataQuery = (date) => {
  return `SELECT c.org_city, min(amount) as OB, max(valuation_date) as latest_valuation_date 
  from dwd_tb_contracts_valuations a
  LEFT JOIN (SELECT DISTINCT contract_id, counterparty_id FROM dwd_term_based_contracts) b
  ON a.contract_id=b.contract_id
  LEFT JOIN (SELECT DISTINCT counterparty_id, org_city from dwd_cpty_organizations) c
  ON b.counterparty_id=c.counterparty_id
  WHERE valuation_type IN ('AMOUNT_OUTSTANDING') 
  AND valuation_date <= '${date}'  GROUP BY c.org_city, a.contract_id ORDER BY a.contract_id`;
};

const productTypeDataQuery = (date) => {
  return `SELECT char_user_field2, min(amount) as OB, max(valuation_date) as latest_valuation_date 
  from dwd_tb_contracts_valuations a
  LEFT JOIN dwd_term_based_contracts b
  ON a.contract_id=b.contract_id
  WHERE valuation_type IN ('AMOUNT_OUTSTANDING') 
  AND valuation_date <= '${date}'  GROUP BY a.contract_id, b.char_user_field2 ORDER BY a.contract_id
`;
};

const amortizationDataQuery = (date) => {
  return `Select organisation_name,paymentdueon,dueamount 
  from dwd_tb_payment_schedule a
  JOIN (SELECT DISTINCT contract_id, counterparty_id from dwd_term_based_contracts) b
  ON a.contract_id=b.contract_id
  JOIN (SELECT DISTINCT counterparty_id, organisation_name from dwd_cpty_organizations) c
  ON b.counterparty_id=c.counterparty_id
  where component IN('PRINCIPAL') 
  and record_valid_to = '9999-12-31' and paymentdueon >='${date}'`;
};

const totalOBQuery = () => {
  return `SELECT SUM(ob) from (SELECT contract_id, min(amount) as OB, max(valuation_date) as latest_valuation_date from dwd_tb_contracts_valuations WHERE valuation_type IN ('AMOUNT_OUTSTANDING') 
  AND valuation_date <= '${
    new Date().toISOString().split("T")[0]
  }'  GROUP BY contract_id ORDER BY contract_id) AS total_ob`;
};

const totalLoansAmountQuery = () => {
  return `select sum(loan_size) from (Select sanctioned_amount as loan_size FROM dwd_term_based_contracts 
    WHERE record_valid_to = '9999-12-31') as total`;
};

const lateDaysDataQuery = (date) => {
  return `select d.OB, organisation_name, invoice_duedate
  from dwd_tb_contracts_invoices a
  LEFT JOIN (SELECT DISTINCT contract_id, counterparty_id from dwd_term_based_contracts) b
  ON a.contract_id=b.contract_id
  LEFT JOIN (SELECT DISTINCT counterparty_id, organisation_name from dwd_cpty_organizations) c
  ON b.counterparty_id=c.counterparty_id
  JOIN (SELECT contract_id, min(amount) as OB, max(valuation_date) as latest_valuation_date from dwd_tb_contracts_valuations WHERE valuation_type IN ('AMOUNT_OUTSTANDING') 
  AND valuation_date <= '${date}'  GROUP BY contract_id ORDER BY contract_id) d
  ON d.contract_id=a.contract_id
  WHERE invoice_duedate < '${date}' and (invoice_paiddate > '${date}' or invoice_paiddate is null) and component = 'PRINCIPAL'
  ORDER BY a.contract_id`;
};

// select d.OB, organisation_name, invoice_duedate
//   from dwd_tb_contracts_invoices a
//   LEFT JOIN (SELECT DISTINCT contract_id, counterparty_id from dwd_term_based_contracts) b
//   ON a.contract_id=b.contract_id
//   LEFT JOIN (SELECT DISTINCT counterparty_id, organisation_name from dwd_cpty_organizations) c
//   ON b.counterparty_id=c.counterparty_id
//   JOIN (SELECT contract_id, min(amount) as OB, max(valuation_date) as latest_valuation_date from dwd_tb_contracts_valuations WHERE valuation_type IN ('AMOUNT_OUTSTANDING') 
//   AND valuation_date <= '2020-03-26'  GROUP BY contract_id ORDER BY contract_id) d
//   ON d.contract_id=a.contract_id
//   WHERE invoice_paiddate is null and component = 'PRINCIPAL'
//   ORDER BY a.contract_id


const totalInterestDataQuery = () => {
  return `select sum(paid_interest) from 
  (Select min(duedate) as first_interest_date, sum(unpaidamount) as scheduled_unpaid_interest,sum(paidamount) as paid_interest 
  FROM dwd_tb_payment_schedule 
   WHERE component IN ('INTEREST') 
   AND record_valid_to = '9999-12-31' ) as total`;
};

const orgDataQuery = (contractId) => {
  return `SELECT a.contract_id, x.counterparty_id, x.product_code, a.disbursement_date, a.final_repayment_date,x.loan_size,x.char_user_field2, x.interest_rate,x.contract_category, x.contract_date, x.maturity_date,b.first_amortization_date, b.OB,g.unpaid_principal_im, b.repaid_principal,g.repaid_principal_im,
  c.first_interest_date, c.scheduled_unpaid_interest,e.scheduled_unpaid_im_interest,f.scheduled_unpaid_interest_diff, c.paid_interest,e.paid_im_interest,f.paid_interest_diff,d.org_city, d.organisation_name, d.registration_no,penp.scheduled_unpaid_penalty_principal,penp.paid_penalty_principal,peni.scheduled_unpaid_penalty_interest , peni.paid_penalty_interest,
  CASE WHEN first_amortization_date <= current_date AND contract_category = 'Performing' THEN 'YES' ELSE 'NO' END AS amortization
  FROM
  (Select contract_id, min(duedate) as disbursement_date,max(duedate) as final_repayment_date FROM dwd_tb_payment_schedule GROUP BY contract_id) a
  LEFT OUTER JOIN
  (Select contract_id, sanctioned_amount as loan_size, interest_rate, product_code, contract_category, contract_date, maturity_date, counterparty_id, char_user_field2 FROM dwd_term_based_contracts WHERE record_valid_to = '9999-12-31') x ON a.contract_id = x.contract_id
  LEFT OUTER JOIN
  (Select contract_id, min(duedate) as first_amortization_date, sum(unpaidamount) as OB, sum(paidamount) as repaid_principal FROM dwd_tb_payment_schedule WHERE component IN ('PRINCIPAL') AND record_valid_to = '9999-12-31' GROUP BY contract_id) b ON a.contract_id = b.contract_id
  LEFT OUTER JOIN
  (Select contract_id, sum(unpaidamount) as unpaid_principal_im, sum(paidamount) as repaid_principal_im FROM dwd_tb_payment_schedule WHERE component IN ('PRINCIPAL_INTERMEDIATE') AND record_valid_to = '9999-12-31' GROUP BY contract_id) g ON a.contract_id = g.contract_id
  LEFT OUTER JOIN
  (Select contract_id, min(duedate) as first_interest_date, sum(unpaidamount) as scheduled_unpaid_interest,sum(paidamount) as paid_interest FROM dwd_tb_payment_schedule WHERE component IN ('INTEREST') AND record_valid_to = '9999-12-31' GROUP BY contract_id) c ON a.contract_id = c.contract_id
  LEFT OUTER JOIN
  (Select contract_id, sum(unpaidamount) as scheduled_unpaid_im_interest,sum(paidamount) as paid_im_interest FROM dwd_tb_payment_schedule WHERE component IN ('INTEREST_INTERMEDIATE') AND record_valid_to = '9999-12-31' GROUP BY contract_id) e ON a.contract_id = e.contract_id
  LEFT OUTER JOIN
  (Select contract_id, sum(unpaidamount) as scheduled_unpaid_interest_diff,sum(paidamount) as paid_interest_diff FROM dwd_tb_payment_schedule WHERE component IN ('INTEREST_DIFFERENCE') AND record_valid_to = '9999-12-31' GROUP BY contract_id) f ON a.contract_id = f.contract_id
  LEFT OUTER JOIN
  (Select contract_id, sum(unpaidamount) as scheduled_unpaid_penalty_principal,sum(paidamount) as paid_penalty_principal FROM dwd_tb_payment_schedule WHERE component IN ('PENALTY_ON_PRINCIPAL_OVERDUE') AND record_valid_to = '9999-12-31' GROUP BY contract_id) penp ON a.contract_id = penp.contract_id
  LEFT OUTER JOIN
  (Select contract_id, sum(unpaidamount) as scheduled_unpaid_penalty_interest,sum(paidamount) as paid_penalty_interest FROM dwd_tb_payment_schedule WHERE component IN ('PENALTY_ON_PRINCIPAL_OVERDUE') AND record_valid_to = '9999-12-31' GROUP BY contract_id) peni ON a.contract_id = peni.contract_id
  LEFT OUTER JOIN
  (SELECT counterparty_id, org_city, organisation_name, registration_no FROM dwd_cpty_organizations WHERE record_valid_to = '9999-12-31' ORDER BY counterparty_id) d ON x.counterparty_id = d.counterparty_id
  where a.contract_id='${contractId}'
  ORDER BY contract_id asc`;
} 

const contractIDQuery = (paymentDueOn, dueAmount, organisationName) => {
  return `Select a.contract_id, organisation_name,paymentdueon,dueamount 
  from dwd_tb_payment_schedule a
  JOIN (SELECT DISTINCT contract_id, counterparty_id from dwd_term_based_contracts) b
  ON a.contract_id=b.contract_id
  JOIN (SELECT DISTINCT counterparty_id, organisation_name from dwd_cpty_organizations) c
  ON b.counterparty_id=c.counterparty_id
  where component IN('PRINCIPAL') 
  and record_valid_to = '9999-12-31' and paymentdueon ='${paymentDueOn}' and dueamount=${dueAmount} and organisation_name='${organisationName}'`;
}

module.exports = {
  locationDataQuery,
  productTypeDataQuery,
  amortizationDataQuery,
  totalOBQuery,
  totalLoansAmountQuery,
  lateDaysDataQuery,
  totalInterestDataQuery,
  orgDataQuery,
  contractIDQuery
};
