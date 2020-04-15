import React from 'react'
import './style/Dashboard.css';
import AmortizationChart from './charts/AmortizationChart'
import LocationChart from './charts/LocationChart'
import ProductTypeChart from './charts/ProductTypeChart';
import TotalObCard from './charts/TotalObCard';
import PaidBackChart from './charts/PaidBackChart';
import LatePaymentChart from './charts/LatePaymentsChart';
import TotalInterestCard from './charts/TotalInterestCard';

function Dashboard({ date }) {
  return (
    <div className="dashboard">
      <TotalObCard />
      <PaidBackChart />
      <TotalInterestCard />
      <AmortizationChart/>
      <LocationChart/>
      <ProductTypeChart />
      <LatePaymentChart />
    </div>
  )
}

export default Dashboard
