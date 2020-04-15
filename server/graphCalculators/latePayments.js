const calcLatePaymentsChart = (lateDays, totalOB, date) => {
  const labels = ["10 - 20", "20 - 30", "30 - 45", "45 - 90", "90+"];

  lateDays.forEach((item) => item.ob = Number(item.ob));

  /* Add together ob on same day and org */
  for (let i = 0; i < lateDays.length; i++) {
    for (let j = i + 1; j < lateDays.length; j++) {
      if ((lateDays[i].organisation_name === lateDays[j].organisation_name) && (lateDays[i].invoice_duedate.getTime() === lateDays[j].invoice_duedate.getTime())) {
        lateDays[i].ob += lateDays[j].ob;
        lateDays.splice(j, 1);
      }
    }
  }

  /* Get all organisations */
  const orgs = [...new Set(lateDays.map((item) => item.organisation_name))].filter(item => item !== null);
  
  const datasets = orgs.map((org, i) => ({
    label: org,
    data: new Array(5).fill(0),
  }));

  lateDays.forEach((item) => {
    const oneDay = 24 * 60 * 60 * 1000;
    const a = item.invoice_duedate;
    const b = new Date(date);
    const diffDays = Math.round(Math.abs((a - b) / oneDay));


    switch (true) {
      case diffDays >= 10 && diffDays < 20:
        datasets.forEach(org => {
          if (org.label === item.organisation_name) {
            org.data[0] = (item.ob / totalOB) * 100;
          }
        })
        break;
      case diffDays >= 20 && diffDays < 30:
        datasets.forEach(org => {
          if (org.label === item.organisation_name) {
            org.data[1] = (item.ob / totalOB) * 100;
          }
        })
        break;
      case diffDays >= 30 && diffDays < 45:
        datasets.forEach(org => {
          if (org.label === item.organisation_name) {
            org.data[2] = (item.ob / totalOB) * 100;
          }
        })
        break;
      case diffDays >= 45 && diffDays < 90:
        datasets.forEach(org => {
          if (org.label === item.organisation_name) {
            org.data[3] = (item.ob / totalOB) * 100;
          }
        })
        break;
      case diffDays >= 90:
        datasets.forEach(org => {
          if (org.label === item.organisation_name) {
            org.data[4] = (item.ob / totalOB) * 100;
          }
        })
        break;
      default:
        break;
    }
  });


  return {
    labels,
    datasets
  };
};

module.exports = calcLatePaymentsChart;
