document.addEventListener("DOMContentLoaded", () => {
  const bookedCarsLink = document.getElementById("bookedCarsLink");
  const manageCarsLink = document.getElementById("manageCarsLink");
  const logoutLink = document.getElementById("logoutLink");

  // Function to fetch and display booked cars
  function loadBookedCars() {
    fetch('/booking')  // Ensure this matches the endpoint where bookings are served
      .then(handleResponse)
      .then(bookedCars => displayBookedCars(bookedCars))
      .catch(error => handleError(error));
  }

  // Handle the response and check if it's OK
  function handleResponse(response) {
    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }
    return response.json();
  }

  // Display booked cars in the content section
  function displayBookedCars(bookedCars) {
    const content = document.getElementById("content");
    if (bookedCars.length === 0) {
      content.innerHTML = `<h2>No Booked Cars Available</h2>`;
      return;
    }
    content.innerHTML = `
      <h2>Booked Cars</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Car Name</th>
            <th>Customer</th>
            <th>Date Debut</th>
            <th>Date Fin</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${bookedCars.map(car => `
            <tr>
              <td>${car.id}</td>
              <td>${car.name}</td>
              <td>${car.customer}</td>
              <td>${car.date_debut}</td>
              <td>${car.date_fin}</td>
              <td><button class="delete-btn" data-id="${car.id}">Delete</button></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  // Handle errors and display error message
  function handleError(error) {
    console.error('Error fetching data:', error);
    const content = document.getElementById("content");
    content.innerHTML = `<h2>Error fetching data: ${error.message}</h2>`;
  }

  // Function to manage car form
  function manageCarsForm() {
    const content = document.getElementById("content");
    content.innerHTML = `
      <h2>Manage Cars</h2>
      <form id="addCarForm">
        <input type="text" id="carName" placeholder="Car Name" required>
        <input type="text" id="customerName" placeholder="Customer Name" required>
        <input type="date" id="bookingDate" required>
        <input type="date" id="bookingDateEnd" required>
        <button type="submit">Add Booking</button>
      </form>
    `;

    const addCarForm = document.getElementById("addCarForm");
    addCarForm.addEventListener("submit", handleAddBooking);
  }

  // Handle the form submission to add a new booking
  function handleAddBooking(e) {
    e.preventDefault();
    const carName = document.getElementById("carName").value;
    const customerName = document.getElementById("customerName").value;
    const bookingDate = document.getElementById("bookingDate").value;
    const bookingDateEnd = document.getElementById("bookingDateEnd").value;

    const newBooking = {
      id: Date.now(), // using timestamp as ID for simplicity
      name: carName,
      customer: customerName,
      date_debut: bookingDate,
      date_fin: bookingDateEnd,
    };

    fetch('/booking', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newBooking),
    })
    .then(response => response.json())
    .then(() => loadBookedCars()) // Refresh the booking list after adding
    .catch(error => handleError(error));
  }

  // Delete a booking by ID
  function deleteBooking(carId) {
    fetch(`/booking/${carId}`, { method: 'DELETE' })
      .then(() => loadBookedCars()) // Refresh the booking list after deletion
      .catch(error => handleError(error));
  }

  // Event listener for deleting a booking
  document.body.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-btn")) {
      const carId = e.target.getAttribute("data-id");
      deleteBooking(carId);
    }
  });

  // Event listener for Booked Cars link
  bookedCarsLink.addEventListener("click", () => {
    loadBookedCars();
  });

  // Event listener for Manage Cars link
  manageCarsLink.addEventListener("click", () => {
    manageCarsForm();
  });

  // Event listener for Logout link
  logoutLink.addEventListener("click", () => {
    alert("You have been logged out.");
    window.location.href = "/index.html"; // Redirect to login page
  });
});
