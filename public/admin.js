document.addEventListener("DOMContentLoaded", () => {
  const bookedCarsLink = document.getElementById("bookedCarsLink");
  const manageCarsLink = document.getElementById("manageCarsLink");
  const logoutLink = document.getElementById("logoutLink");

  // Function to fetch and display booked cars
  function loadBookedCars() {
    fetch("/booking")
      .then(handleResponse)
      .then((bookedCars) => displayBookedCars(bookedCars))
      .catch((error) => handleError(error));
  }

  // Function to fetch and display cars
  function loadCars() {
    fetch("/cars")
      .then(handleResponse)
      .then((cars) => manageCarsForm(cars))
      .catch((error) => handleError(error));
  }

  // Handle the response and check if it's OK
  function handleResponse(response) {
    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
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
            <th>User Email</th>
            <th>Car Name</th>
            <th>Date Debut</th>
            <th>Date Fin</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${bookedCars
            .map(
              (car) => `
            <tr>
              <td>${car.user}</td>
              <td>${car.nameCar}</td>
              <td>${car.startDate}</td>
              <td>${car.endDate}</td>
              <td>
                <button class="delete-btn-book" data-id="${car.user}">Delete</button>
              </td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
    `;
  }

  // Handle errors and display error message
  function handleError(error) {
    console.error("Error fetching data:", error);
    const content = document.getElementById("content");
    content.innerHTML = `<h2>Error fetching data: ${error.message}</h2>`;
  }

  // Function to manage car form
  function manageCarsForm(cars) {
    const content = document.getElementById("content");
    content.innerHTML = `
    <h2>Manage Cars</h2>
    <form id="addCarForm">
      <input type="text" id="carName" placeholder="Car Name" required>
      <input type="text" id="carModel" placeholder="Car Model" required>
      <input type="number" id="price" required min="0" placeholder="Price of the car">
      <input type="text" id="image" required placeholder="Link of the car">
      <button type="submit">Add Car</button>
    </form>
    <h2>Available Cars</h2>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Car Name</th>
          <th>Car Model</th>
          <th>Price</th>
          <th>Image</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
      ${cars
        .map(
          (car) => `
          <tr>
            <td><input type="text" value="${car.carId}" disabled/></td>
            <td><input type="text" value="${car.name}" disabled/></td>
            <td><input type="text" value="${car.model}" disabled/></td>
            <td><input type="number" value="${car.price}" disabled/></td>
            <td><input type="text" value="${car.image}" disabled/></td>
            <td>
              <button class="update-btn-car" data-id="${car.carId}">Update</button>
              <button class="delete-btn-car" data-id="${car.carId}">Delete</button>
            </td>
          </tr>
        `
        )
        .join("")}
      </tbody>
    </table>
  `;

    const addCarForm = document.getElementById("addCarForm");
    addCarForm.addEventListener("submit", handleAddCar);

    const table = content.querySelector("table");
    table.addEventListener("click", (event) => {
      const target = event.target;

      if (target.classList.contains("update-btn-car")) {
        const row = target.closest("tr");
        const inputs = row.querySelectorAll(
          "input[type='text'], input[type='number']"
        );

        if (inputs[0].disabled) {
          inputs.forEach((input) => (input.disabled = false));
          target.textContent = "Save";
        } else {
          const updatedCar = {
            carId: inputs[0].value,
            name: inputs[1].value,
            model: inputs[2].value,
            price: parseFloat(inputs[3].value),
            image: inputs[4].value,
          };
          updateCar(updatedCar);
          inputs.forEach((input) => (input.disabled = true));
          target.textContent = "Update";
        }
      }

      if (target.classList.contains("delete-btn-car")) {
        const carId = target.dataset.id;
        deleteCar(carId);
      }
    });
  }

  function handleAddCar(e) {
    e.preventDefault();
    const carId = Date.now();
    const carName = document.getElementById("carName").value.trim();
    const carModel = document.getElementById("carModel").value.trim();
    const price = parseFloat(document.getElementById("price").value);
    const image = document.getElementById("image").value.trim();

    const newCar = {
      carId,
      name: carName,
      model: carModel,
      price,
      image,
    };

    fetch("/cars", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCar),
    })
      .then((response) => response.json())
      .then(() => loadCars())
      .catch((error) => handleError(error));
  }

  function deleteCar(carId) {
    fetch(`/cars/${carId}`, { method: "DELETE" })
      .then(() => loadCars())
      .catch((error) => handleError(error));
  }

  function updateCar(updatedCar) {
    fetch(`/update/car/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedCar),
    })
      .then(() => loadCars())
      .catch((error) => handleError(error));
  }

  if (bookedCarsLink) {
    bookedCarsLink.addEventListener("click", loadBookedCars);
  }

  if (manageCarsLink) {
    manageCarsLink.addEventListener("click", loadCars);
  }

  if (logoutLink) {
    logoutLink.addEventListener("click", async () => {
      try {
        const response = await fetch("/logout", { method: "POST" });
        if (response.ok) {
          alert("Logout successful");
          window.localStorage.clear();
          window.location.href = "/";
        } else {
          alert("Logout failed");
        }
      } catch (error) {
        console.error("Error logging out:", error);
      }
    });
  }
});
