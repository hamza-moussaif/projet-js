import { Chart } from "chart.js";

// Get the canvas element
const ctx = document.getElementById("myChart").getContext("2d");

// Create the chart
const myChart = new Chart(ctx, {
  type: "bar",
  data: {
    labels: ["Car 1", "Car 2", "Car 3", "Car 4", "Car 5"],
    datasets: [
      {
        label: "Booked Cars",
        data: [5, 10, 15, 20, 25],
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  },
  options: {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
});

// Function to load the car data
function loadCars() {
  fetch("/cars")
    .then(handleResponse)
    .then((cars) => {
      updateChart(cars);
    })
    .catch((error) => handleError(error));
}

// Function to handle the response from the server
function handleResponse(response) {
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
}

// Function to handle any errors
function handleError(error) {
  console.error("There was a problem with the fetch operation:", error);
}

// Function to update the chart with fetched data
function updateChart(cars) {
  // Assuming `cars` is an array of car objects, and we're interested in the "booked" status
  const carNames = cars.map((car) => car.name);
  const bookedCars = cars.map((car) => car.price); // Assuming each car has a "booked" property

  // Update the chart data
  myChart.data.labels = carNames;
  myChart.data.datasets[0].data = bookedCars;

  // Re-render the chart
  myChart.update();
}

// Call `loadCars` to load data from the server
loadCars();
