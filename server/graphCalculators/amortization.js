const calcAmortizationChart = data => {

  /* Removing duplicate dates */
  const dates = [
    ...new Set(
      data
        .sort((a, b) => new Date(a.paymentdueon) - new Date(b.paymentdueon))
        .map(item => item.paymentdueon.getTime())
    )
  ];

  /* Get all organisations */
  const orgs = [...new Set(data.map(item => item.organisation_name))];

  /* Create an object for each organisation */
  const datasets = orgs.map((org, i) => ({
    label: org,
    data: new Array(dates.length).fill(0)
  }));

  /* Fill data for each organisation */
  data.forEach(item => {
    datasets.forEach(dataset => {
      if (dataset.label === item.organisation_name) {
        const index = dates.indexOf(item.paymentdueon.getTime());
        dataset.data[index] += item.dueamount;
      }
    });
  });

  return {
    labels: dates
      .map(item => {
        const oneDay = 24 * 60 * 60 * 1000;
        const newDate = new Date(item + oneDay);
        return newDate;
      })
      .map(item => item.toISOString().split("T")[0]),
    datasets
  };
};

module.exports = calcAmortizationChart;
