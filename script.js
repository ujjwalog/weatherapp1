const apiKey = "e13def7ca5a5fe031c7aa38ad79ec40e";

const searchInput = document.querySelector(".search input");
const searchButton = document.querySelector(".search button");

searchButton.addEventListener("click", () => {
  const city = searchInput.value.trim();
  if (city !== "") {
    getWeatherData(city);
  }
});

async function getWeatherData(city) {
  try {
    // Fetch current weather
    const currentRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
    );
    const currentData = await currentRes.json();

    if (currentData.cod !== 200) {
      alert("City not found!");
      return;
    }

    // Fetch 5-day forecast
    const forecastRes = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`
    );
    const forecastData = await forecastRes.json();

    updateCurrentWeather(currentData);
    updateForecast(forecastData);
  } catch (error) {
    console.error("Error:", error);
    alert("Failed to load weather data.");
  }
}

function updateCurrentWeather(data) {
  document.querySelector(".city").textContent = data.name;
  document.querySelector(".temperature h1").textContent = `${Math.round(data.main.temp)}°C`;
  document.querySelector(".condition span").textContent = data.weather[0].main;
  document.querySelector(".condition img").src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

  document.querySelectorAll(".detail .value")[0].textContent = `${data.main.humidity}%`;
  document.querySelectorAll(".detail .value")[1].textContent = `${data.wind.speed} km/h`;
  document.querySelectorAll(".detail .value")[2].textContent = `${data.main.pressure} hPa`;

  const now = new Date();
  document.querySelector(".date").textContent = now.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function updateForecast(data) {
  const container = document.querySelector(".forecast-days");
  container.innerHTML = ""; // Clear old forecast

  const dailyData = {};
  data.list.forEach((item) => {
    const date = new Date(item.dt_txt);
    const day = date.toLocaleDateString("en-US", { weekday: "short" });
    if (!dailyData[day] && date.getHours() === 12) {
      dailyData[day] = item;
    }
  });

  const days = Object.keys(dailyData).slice(0, 5);

  days.forEach((day) => {
    const item = dailyData[day];
    const icon = item.weather[0].icon;
    const temp = Math.round(item.main.temp);
    const condition = item.weather[0].main;

    const dayCard = `
      <div class="day">
        <span>${day}</span>
        <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${condition}">
        <span>${temp}°C</span>
      </div>
    `;
    container.innerHTML += dayCard;
  });
}
