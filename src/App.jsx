import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [data, setData] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedCity, setSelectedCity] = useState();
  const [weather, setWeather] = useState(null);
  const [isWeatherLoading, setIsWeatherLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://api.jsonbin.io/v3/b/66b1ed48e41b4d34e41c65ce');
        setData(response?.data?.record?.countries || []);
      } catch (error) {
        console.error('Error fetching api:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const filteredCities = data.find(country => country.name === selectedCountry);
    setFilteredCities(filteredCities);

  }, [selectedCountry]);

  useEffect(() => {
    const fetchWeather = async () => {
      if (!selectedCity) return;
      setIsWeatherLoading(true);
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${selectedCity}&units=metric&appid=5c42e4061773049454107753a3e2ddc2`)
      try {
        
        setWeather(response.data);
      } catch (error) {
        console.error('Error fetching weather:', error);
      } finally {
        setIsWeatherLoading(false);
      }
    };

    fetchWeather();
  }, [selectedCity]);

  return (<>
    <div class="card">
      <div class="search">
        <div>
          <label htmlFor="country">Select Country:</label>
          <select
            id="country"
            value={selectedCountry}
            onChange={(e) => {
              setSelectedCountry(e.target.value);
              setSelectedCity(); // Reset city when country changes
              setFilteredCities([]);
              setWeather(null);
            }}
          >
            {!selectedCountry && <option value="">Select a country</option>}
            {data?.map((country) => (
              <option key={country.name} value={country.name}>
                {country.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="city">Select City:</label>
          <select
            id="city"
            value={selectedCity}
            onChange={(e) => {
              setSelectedCity(e.target.value)

            }}
            disabled={!selectedCountry}
          >
            {!selectedCity && <option value="">Select a city</option>}
            {filteredCities?.cities?.map((city) => {
              return (
                <option key={city.name} value={city?.name}>
                  {city.name}
                </option>
              )
            }
            )}
          </select>
        </div>

      </div>
      {isWeatherLoading ? (
        <div className="weather loading">
          <h2>Loading weather data...</h2>
        </div>
      ) : weather ? 
      <div class="weather loading">
        <h2 class="city">Weather in {selectedCity}</h2>
        <h1 class="temp">{weather?.main?.temp}°C</h1>
        <div class="flex">

          <div class="description">{weather?.weather?.description}</div>
        </div>
        <div class="humidity">Humidity: {weather?.main?.humidity}%</div>
        <div class="wind">Wind speed: {weather?.wind?.speed} km/h</div>
      </div>
      : null}
    </div>
  </>
  );
};

export default App;
