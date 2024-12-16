/////////////// darkboard
// Traffic Chart
const trafficCtx = document.getElementById("trafficChart").getContext("2d");
new Chart(trafficCtx, {
  type: "line",
  data: {
    labels: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    datasets: [
      {
        label: "Website Traffic",
        data: [120, 200, 150, 220, 300, 250, 400],
        borderColor: "#007bff",
        backgroundColor: "rgba(0, 123, 255, 0.2)",
        fill: true,
      },
    ],
  },
  options: {
    responsive: true,
    plugins: {
      legend: { position: "top" },
    },
  },
});

// User Chart
const userCtx = document.getElementById("userChart").getContext("2d");
new Chart(userCtx, {
  type: "bar",
  data: {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        label: "New Users",
        data: [30, 50, 70, 60, 90, 120],
        backgroundColor: [
          "#28a745",
          "#ffc107",
          "#007bff",
          "#17a2b8",
          "#dc3545",
          "#6c757d",
        ],
      },
    ],
  },
  options: {
    responsive: true,
    plugins: {
      legend: { position: "top" },
    },
  },
});

// Popular Articles Chart
const popularArticlesCtx = document
  .getElementById("popularArticlesChart")
  .getContext("2d");
new Chart(popularArticlesCtx, {
  type: "pie",
  data: {
    labels: ["Article A", "Article B", "Article C", "Article D"],
    datasets: [
      {
        label: "Popularity",
        data: [35, 25, 20, 20],
        backgroundColor: ["#007bff", "#ffc107", "#dc3545", "#28a745"],
      },
    ],
  },
  options: {
    responsive: true,
    plugins: {
      legend: { position: "top" },
    },
  },
});
