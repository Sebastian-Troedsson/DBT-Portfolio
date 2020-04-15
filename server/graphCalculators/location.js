const calcLocationChart = data => {
  const totalStockholm = data
    .filter(location => location.org_city === 'Stockholm')
    .reduce((tot, cur) => tot + Number(cur.ob), 0)
    .toFixed();
  const totalOther = data
    .filter(location => location.org_city !== 'Stockholm' && location.org_city !== null)
    .reduce((tot, cur) => tot + Number(cur.ob), 0)
    .toFixed();
  const totalUnlabeled = data
    .filter(location => location.org_city === null)
    .reduce((tot, cur) => tot + Number(cur.ob), 0)
    .toFixed();
  return {
    labels: ['Stockholm', 'Other', 'Unlabeled'],
    datasets: [
      {
        data: [
          totalStockholm,
          totalOther,
          totalUnlabeled
        ],
        backgroundColor: ['#521499', '#0088A3', 'rgb(198, 49, 79)'],
        borderWidth: 0
      },
    ],
  };
};

module.exports = calcLocationChart;