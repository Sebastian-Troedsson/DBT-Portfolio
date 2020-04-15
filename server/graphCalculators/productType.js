const calcProductTypeChart = data => {
  const acquisitionLoan = data.reduce((tot, cur) => cur.char_user_field2 === 'Förvärvslån' ? tot + Number(cur.ob) : tot, 0);
  const liquidityLoan = data.reduce((tot, cur) => cur.char_user_field2 === 'Likviditetslån' ? tot + Number(cur.ob) : tot, 0);
  const growthLoan = data.reduce((tot, cur) => cur.char_user_field2 === 'Tillväxtlån' ? tot + Number(cur.ob) : tot, 0);
  const unlabeled = data.reduce((tot, cur) => cur.char_user_field2 === null ? tot + Number(cur.ob) : tot, 0);
  return {
    labels: ['Förvärvslån', 'Likviditetslån', 'Tillväxtlån', 'Unlabeled'],
    datasets: [
      {
        data: [
          acquisitionLoan,
          liquidityLoan,
          growthLoan,
          unlabeled
        ],
        backgroundColor: ['#521499', '#E47D1E', '#0088A3', 'rgb(198, 49, 79)'],
        borderWidth: 0
      }
    ]
  };
};

module.exports = calcProductTypeChart;