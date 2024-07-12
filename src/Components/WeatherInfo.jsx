import React, { useState, useEffect } from "react";
import "../App.css";
export default function WeatherInfo() {
  const [data, setData] = useState({});
  const [location, setLocation] = useState('new delhi');
  const [message, setMessage] = useState(
    `⚠️Please allow location access to obtain the weather information. Or location can also be searched manually.`
  );

  // Api key
  const key = `a9a5e6249ca74f65a35111821241207`;

  const [userPosition, setUserPosition] = useState({
    latitude: 25,
    longitude: 85,
  });

  useEffect(() => {
    // Check whether geolocation is supported
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        // Get the lat and long of your device
        const pos = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        console.log('pos', pos);
        setUserPosition(pos);
        setTimeout(() => {
          setMessage("");
        }, 1008);

        // Weather API Auto call
        const fetchAutoData = async () => {
          const url = `http://api.weatherapi.com/v1/forecast.json?key=a9a5e6249ca74f65a35111821241207&q=${pos.latitude},${pos.longitude}&days=5&aqi=no&alerts=no`;
          try {
            const response = await fetch(url);
            const jsonData = await response.json();
            const autoWeather = {
              date: jsonData.current.last_updated,
              temperature: jsonData.current.temp_c,
              description: jsonData.current.condition.text,
              location: jsonData.location.name,
              region: jsonData.location.region,
              country: jsonData.location.country,
              wind_speed: jsonData.current.wind_kph,
              pressure: jsonData.current.pressure_mb,
              precip: jsonData.current.precip_mm,
              humidity: jsonData.current.humidity,
              img: jsonData.current.condition.icon,
              nextDay: jsonData.forecast.forecastday[0].day.avgtemp_c,
              nextDayIcon: jsonData.forecast.forecastday[0].day.condition.icon,

            };
            setData(autoWeather);
            console.log('jsonData',jsonData);
          } catch (error) {
            console.error("Error fetching data:", error);
          }
        };
        fetchAutoData();
      });
    }
    console.log('data',data);
  }, []);
  // Weather API call
  useEffect(() => {
    const fetchData = async () => {
      const url = `https://api.weatherapi.com/v1/forecast.json?key=${key}&q=${location}&days=1&aqi=yes`;

      try {
        const response = await fetch(url);
        const jsonData = await response.json();
        const userWeather = {
          date: jsonData.current.last_updated,
          temperature: jsonData.current.temp_c,
          description: jsonData.current.condition.text,
          location: jsonData.location.name,
          region: jsonData.location.region,
          country: jsonData.location.country,
          wind_speed: jsonData.current.wind_kph,
          pressure: jsonData.current.pressure_mb,
          precip: jsonData.current.precip_mm,
          humidity: jsonData.current.humidity,
          img: jsonData.current.condition.icon,
          nextDay: jsonData.forecast.forecastday[0].day.avgtemp_c,
          nextDayIcon: jsonData.forecast.forecastday[0].day.condition.icon,

        };
        setData(userWeather);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [location]);

  return (
    <div className="App">
      <header>The Weather Channel and forecast</header>
      <div className="search">
        <input
          type="text"
          placeholder="&nbsp;&nbsp;search location"
          value={location}
          onChange={(e) => {
            setLocation(e.target.value);

            setTimeout(() => {
              setMessage("");
            }, 2008);
          }}
        ></input>
      </div>
      {data? (<p>{message}</p>) : null}


      <div className="card">
        <div className="location">
          <span>
            {data.location}, {data.region}, {data.country}.
            <hr></hr>
            <div>{data.date}</div>
          </span>
        </div>
        <div className="info">
          <div className="main_left">
            <img src={data.img}></img>
            <span> &nbsp;{data.description}</span>
          </div>
          <div className="main_middle">
            <span className="current_temperature">
              {data.temperature + "°c"}
            </span>
          </div>

          <div className="main_right">
            <span className="wind">Wind: {data.wind_speed} kmph</span>
            <span className="precip">Precip: {data.precip} mm</span>
            <span className="pressure">Pressure: {data.pressure} mb</span>
          </div>
        </div>

        <div className="week">
          <div className="day">
            <span className="name">Tomorrow</span>
            <img src={data.nextDayIcon}></img>
            <span className="temperature">{data.nextDay}°c</span>
          </div>
        </div>
      </div>
    </div>
  );
}
