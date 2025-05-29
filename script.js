 const cityInput = document.querySelector(".city-input");
 const searchButton = document.querySelector(".search-btn");
 const locationButton = document.querySelector(".location-btn");
 const currentWeatherDiv = document.querySelector(".current-weather");
 const weatherCardsDiv=document.querySelector(".weather-cards");

 const API_KEY="63006f982898dc8301bd3825dcb3a78b";

 const createWeatherCard=(cityName,weatherItem,index)=>{
          if (index===0){
           return `<div class ="details">
            <h2>${cityName} (${weatherItem.dt_txt.split(" ")[0]})</h2>
            <h4>Temperature : ${(weatherItem.main.temp-273.15).toFixed(2)} cel</h4>
            <h4>Wind:${weatherItem.wind.speed} M/S</h4>
            <h4>humidity:${weatherItem.main.humidity}%</h4>
          </div>
          <div class="icon">
            <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather-icon">
            <h4>${weatherItem.weather[0].description}</h4>
          </div>`

          } 
          else{ 
             return ` <li class="card">
              <h3> (${weatherItem.dt_txt.split(" ")[0]})</h3>
              <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="weather-icon">
              <h4>Temperature : ${(weatherItem.main.temp -273.15).toFixed(2)} cel</h4>
              <h4>Wind:${weatherItem.wind.speed} M/S</h4>
              <h4>humidity:${weatherItem.main.humidity}%</h4>
            </li>`;
          }
 };

 const getWeatherDetails=(cityName,lat,lon)=>{
    const WEATHER_API_URL=`https://api.openweathermap.org/data/2.5/forecast/?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

    fetch(WEATHER_API_URL).then(res=>res.json()).then(data=>{
    
    // filter the forewcast to get a single forecast per day

        const uniqueForecastDays=[];
        const fiveDaysForecast=data.list.filter(forecast=>{ 
        const forecastDate =new Date(forecast.dt_txt).getDate();
        if(!uniqueForecastDays.includes(forecastDate)){
        return uniqueForecastDays.push(forecastDate);
            }
         });


           // Clear only the weather areas, not the input
       currentWeatherDiv.innerHTML = "";
       weatherCardsDiv.innerHTML = "";

      fiveDaysForecast.forEach((weatherItem, index) => {
      const cardHTML = createWeatherCard(cityName, weatherItem, index);
      if (index === 0) {
        currentWeatherDiv.innerHTML = cardHTML;
      } else {
        weatherCardsDiv.insertAdjacentHTML("beforeend", cardHTML);
    }
   });

    }).catch(()=>  {
             
        alert("An error occured while fetching the weather forecast :(");
   
        });
 };

const getCityCoordinates=()=>{
    const cityName = cityInput.value.trim();
     if(!cityName) return;
     const GEOCODING_API_URL=`https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;

// get entered city coordinates(latitude, longitude, name) from the API response

     fetch(GEOCODING_API_URL).then(res=>res.json()).then(data=>{
        if(!data.length)return alert(`No coordinates found for ${cityName}`);
           const {name,lat,lon }=data[0];
           getWeatherDetails(name,lat,lon);
     }).catch(()=>  {        
            alert("An error occured while fetching the coordinates");

     });
}

const getUserCoordinates =()=>{
  navigator.geolocation.getCurrentPosition(
       position=>{
           const { latitude, longitude}= position.coords;
           const REVERSE_GEOCODING_URL=`https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY} `;

           //get city name from reverse geocoding API
           fetch(REVERSE_GEOCODING_URL).then(res=>res.json()).then(data=>{
            const {name}=data[0];
            getWeatherDetails(name,latitude,longitude);
         }).catch(()=>  {        
                alert("An error occured while fetching the place");
    
         });
       },
       error=>{
            if(error.code===error.PERMISSION_DENIED){
              alert("Geolocation request denied.Please reset location permission to grant access");
            }
       }
  );
}

locationButton.addEventListener("click",getUserCoordinates);
searchButton.addEventListener("click",getCityCoordinates);
