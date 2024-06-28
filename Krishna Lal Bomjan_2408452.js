const temp = document.getElementById("temp"),
  condition = document.getElementById("condition"),
  humidity = document.querySelector(".humidity"),
  searchForm = document.querySelector("#search"),
  search = document.querySelector("#query");

const Url = `https://krishna2408452.000webhostapp.com/Krishna%20Lal%20Bomjan_2408452_main.php`;

const searchBox = document.querySelector("#query");
const searchBtn = document.querySelector(".search button");

function createCard(day, iconUrl, temperature) {
  const card = document.createElement("div");
  card.classList.add("card");

  const dayElement = document.createElement("h2");
  dayElement.classList.add(`day-time${day}`);
  dayElement.textContent = day;
  card.appendChild(dayElement);

  const iconElement = document.createElement("div");
  iconElement.classList.add("card-icon");
  const iconImg = document.createElement("img");
  iconImg.classList.add(`icon${day}`);
  iconImg.src = iconUrl;
  iconElement.appendChild(iconImg);
  card.appendChild(iconElement);

  const tempElement = document.createElement("div");
  tempElement.classList.add("day-temp");
  const tempHeading = document.createElement("h2");
  tempHeading.classList.add(`temp${day}`);
  tempHeading.textContent = temperature + "°C";
  tempElement.appendChild(tempHeading);
  card.appendChild(tempElement);

  return card;
}

async function fetchWeatherFromApi(city) {
  const response = await fetch(`${Url}?city=${city}`);
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("City not found");
    }
    throw new Error("Network response was not ok");
  }
  const rawData = await response.json();
  localStorage.setItem(city, JSON.stringify(rawData));
  return rawData;
}

function fetchWeatherFromLocalStorage(city) {
  const storedData = localStorage.getItem(city);
  if (storedData) {
    return JSON.parse(storedData);
  } else {

    
    throw new Error("No data in local storage");
  }
}

function updateUI(rawData) {
  const icon = document.querySelector(".icon");
  icon.src = getWeatherIconUrl(rawData.data[0].iconcode);

  document.querySelector(".date-time").innerHTML = getDateTime(rawData.data[0].dt);
  document.querySelector("#location").innerHTML = rawData.data[0].city;
  document.querySelector(".temp").innerHTML = Math.round(rawData.data[0].temp) + "°C";
  document.querySelector(".humidity").innerHTML = rawData.data[0].humidity + "%";
  document.querySelector(".wind").innerHTML = rawData.data[0].wind + " km/hr";
  document.querySelector(".pressure").innerHTML = rawData.data[0].pressure + "Pa";
  document.querySelector(".condition").innerHTML = rawData.data[0].weather_condition;

  // Display weather data for the next 7 days
  const weatherCards = document.getElementById("weather-cards");
  weatherCards.innerHTML = ""; // Clear existing cards

  for (let i = 0; i <= 6; i++) {
    const dayData = rawData.data[i];
    const card = createCard(
      i,
      getWeatherIconUrl(dayData.iconcode),
      Math.round(dayData.temp)
    );
    weatherCards.appendChild(card);

    const tempElement = document.querySelector(`.temp${i}`);
    tempElement.innerHTML = Math.round(dayData.temp) + "°C";

    const iconElement = document.querySelector(`.icon${i}`);
    iconElement.src = getWeatherIconUrl(dayData.iconcode);

    const dayElement = document.querySelector(`.day-time${i}`);
    dayElement.innerHTML = getDateTime(dayData.dt);
  }
}

async function checkWeather(city) {
  try {
    let rawData;
    if (navigator.onLine) {
      try {
        rawData = await fetchWeatherFromApi(city);
      } catch (error) {
        
          alert("City not found. Please enter a valid city name.");
          return;

        console.error("Error fetching from API:", error.message);
        rawData = fetchWeatherFromLocalStorage(city);
      }
    } else {
      rawData = fetchWeatherFromLocalStorage(city);
    }
    updateUI(rawData);
  } catch (error) {
    console.error("Error:", error.message);
    // alert("Could not retrieve weather data. Please try again later.");
  }
}

function getWeatherIconUrl(iconCode) {
  return `https://openweathermap.org/img/wn/${iconCode}.png`;
}

// this function sets the default city
window.onload = function () {
  const defaultCity = "Suryapet";
  checkWeather(defaultCity);
};

searchBtn.addEventListener("click", () => {
  checkWeather(searchBox.value);
});

function getDateTime(timestamp) {
  let date = new Date(timestamp * 1000); // Convert timestamp to milliseconds
  let hour = date.getHours();
  let minute = date.getMinutes();

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  // This function shows 12-hour format
  hour = hour % 12;
  if (hour === 0) {
    hour = 12;
  }
  if (hour < 10) {
    hour = "0" + hour;
  }
  if (minute < 10) {
    minute = "0" + minute;
  }

  let dayString = days[date.getDay()];
  return `${dayString}, ${hour}:${minute}`;
}

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let city = search.value;
  if (city) {
    checkWeather(city);
  }
});
