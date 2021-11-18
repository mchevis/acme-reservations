import axios from "axios";

const userList = document.querySelector("#users-list");
const restaurantList = document.querySelector("#restaurants-list");
const reservationList = document.querySelector("#reservations-list");

let users, reservations, restaurants;

const renderUsers = () => {
  const userId = window.location.hash.slice(1) * 1;
  const html = users
    .map(
      (user) =>
        `
              <li class='${user.id === userId ? "selected" : ""}'> 
                  <a href='#${user.id}'>
                      ${user.name}
                  </a>
              </li>
          `
    )
    .join("");
  userList.innerHTML = html;
};

restaurantList.addEventListener("click", async (ev) => {
  try {
    const target = ev.target;
    const userId = window.location.hash.slice(1);
    if (target.tagName === "LI") {
      const _reservation = {
        userId: userId,
        restaurantId: target.getAttribute("data-id"),
      };
      const response = await axios.post(
        `/api/users/${userId}/reservations`,
        _reservation
      );
      const reservation = response.data;
      reservations.push(reservation);
      renderReservations();
      renderRestaurants();
    }
  } catch (err) {
    console.log(err);
  }
});

const renderRestaurants = () => {
  const html = restaurants
    .map(
      (rest) =>
        `
                <li data-id='${rest.id}'> 
                        ${rest.name} (${rest.reservations.length})
                    </a>
                </li>
            `
    )
    .join("");
  restaurantList.innerHTML = html;
};

reservationList.addEventListener("click", async (ev) => {
  try {
    const target = ev.target;
    if (target.tagName === "BUTTON") {
      const response = await axios.delete(
        `/api/reservations/${target.getAttribute("res-id")}`
      );
      fetchUserReservations();
      renderReservations();
    }
  } catch (err) {
    console.log(err);
  }
});

const renderReservations = () => {
  const html = reservations
    .map(
      (res) =>
        `
            <li>
                ${res.id}: ${
          restaurants.find((rest) => rest.id === res.restaurantId).name
        } 
        <button res-id='${res.id}'>X</button> 
            </li>
        `
    )
    .join("");
  reservationList.innerHTML = html;
};

const fetchUserReservations = async () => {
  try {
    const userId = window.location.hash.slice(1);
    if (userId) {
      const url = `/api/users/${userId}/reservations`;
      reservations = (await axios(url)).data;
      renderReservations();
    }
  } catch (err) {
    console.log(err);
  }
};

const init = async () => {
  try {
    users = (await axios.get("/api/users")).data;
    restaurants = (await axios.get("/api/restaurants")).data;
    renderUsers();
    renderRestaurants();
    const userId = window.location.hash.slice(1);
    fetchUserReservations();
  } catch (err) {
    console.log(err);
  }
};

window.addEventListener("hashchange", async () => {
  fetchUserReservations();
  renderUsers();
});

init();
