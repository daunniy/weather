import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  text-align: center;
`;

const Button = styled.button`
  text-indent:-9999px;
  border: none;
  cursor: pointer;
  padding: 0;
  position: fixed;
  right: 15px;
  top: 20px;
`;

const LoadingSpinner = styled.div`
  position: absolute;
  top: 50%;
  width: 300px;
  left: 50%;
  margin-left: -150px;
  height: 3px;
  background: rgba(255, 255, 255, .1);
  &:before {
    animation: progress1 4s infinite;
    transform-origin: 0 0;
    content: "";
    display: block;
    width: 300px;
    height: 100%;
    background: linear-gradient(to right, rgba(255, 255, 255, 0.1) 10%, rgba(255, 255, 255, 0.4) 80%, rgba(255, 255, 255, 1));
  }
  &:after {
    content: "";
    position: absolute;
    animation: progress2 4s infinite;
    transform-origin: 90% 50%;
    margin-left: -24px;
    top: -9px;
    width: 30px;
    height: 21px;
    border-radius: 2px;
    background: rgba(210, 189, 255, .55);
    filter: blur(8px);
    box-shadow: 0 0 10px 6px rgba(210, 189, 255, .4),
                -20px 0 15px 4px rgba(210, 189, 255, .3),
                -40px 0 15px 2px rgba(210, 189, 255, .2),
                -60px 0 10px 1px rgba(210, 189, 255, .1),
                -80px 0 10px 1px rgba(210, 189, 255, .05);
  }
  @keyframes progress1 {
    0% {
      transform: scalex(0);
      opacity: .5;
    }
    90% {
      transform: scalex(1);
      opacity: 1;
    }
    100% {
      transform: scalex(1);
      opacity: 0;
    }
  }
  
  @keyframes progress2 {
    0% {
      transform: scale(.3, .8) translatez(0);
      opacity: 0;
    }
    90% {
      transform: scale(1, 1) translatex(300px) translatez(0);
      opacity: 1;
    }
    100% {
      transform: scale(1, 1) translatex(300px) translatez(0);
      opacity: 0;
    }
  }
`;

const cityMapping = {
  '서울': 'Seoul',
  '인천': 'Incheon',
  '수원': 'Suwon-si',
  '성남': 'Seongnam-si',
  '고양': 'Goyang-si',
  '부산': 'Busan',
  '대구': 'Daegu',
  '광주': 'Gwangju',
  '대전': 'Daejeon',
  '울산': 'Ulsan',
  '세종': 'Sejong'
};

function getTodayMinMaxTemp(forecastData) {
  const today = new Date().toDateString(); // 오늘 날짜 가져오기
  const todayForecasts = forecastData.list.filter((forecast) => {
    const forecastDate = new Date(forecast.dt * 1000).toDateString();
    return forecastDate === today; // 오늘 날짜만 필터링
  });

  const minTemp = Math.min(...todayForecasts.map(forecast => forecast.main.temp_min));
  const maxTemp = Math.max(...todayForecasts.map(forecast => forecast.main.temp_max));

  return { minTemp, maxTemp };
}


function WeatherPage() {
  const navigate = useNavigate();
  const { city } = useParams();
  const [weatherData, setWeatherData] = useState(null);
  const [minMaxTemp, setMinMaxTemp] = useState({ minTemp: null, maxTemp: null });
  const [isLoading, setIsLoading] = useState(false);
  const [forecastData, setForecastData] = useState(null);
  const now = Date.now();
  const twentyFourHoursLater = now + 24 * 60 * 60 * 1000; // 현재 시간 + 24시간
  const [backgroundClass, setBackgroundClass] = useState('default');
    
  

  useEffect(() => {
    const fetchWeather = async () => {
      setIsLoading(true);
      const apiKey = '28e07dfa61cced0cd42f9dc297ccc2f8'; // 나의 apiKey
      const mappedCity = cityMapping[city] || city;

      try {
        const weatherResponse = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
          params: {
            q: `${mappedCity},KR`,
            appid: apiKey,
            units: 'metric',
            lang: 'kr',
          }
        });
        const forecastResponse = await axios.get(`https://api.openweathermap.org/data/2.5/forecast`, {
          params: {
            q: `${mappedCity},KR`,
            appid: apiKey,
            units: 'metric',
            lang: 'kr',
          }
        });
        setWeatherData(weatherResponse.data);
        setForecastData(forecastResponse.data);
      } catch (error) {
        alert(error.response.data.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchWeather();
  }, [city]);

  const backMove = () => {
    navigate('/');
  }

  useEffect(() => {
    if (forecastData) {
      const { minTemp, maxTemp } = getTodayMinMaxTemp(forecastData);
      setMinMaxTemp({ minTemp, maxTemp });
    }
  }, [forecastData]);






  function getCustomWeatherDescription(description) {
    switch (description) {
      case '맑음':
        return '맑은 하늘';
      case '튼구름':
        return '구름 많음';
      case '실 비':
        return '가벼운 비';
      default:
        return description; // 기본적으로 원래의 설명을 사용
    }
  }

  useEffect(() => {
    const hour = new Date().getHours();
    const newBackgroundClass = getBackgroundClassByTime(hour);
    setBackgroundClass(newBackgroundClass);
  }, []);

  function getBackgroundClassByTime(hour) {
    return hour >= 6 && hour < 18 ? 'daytime' : 'nighttime';
  }





  return (
    <div className={`background ${backgroundClass}`}>
    <Container className="weatherpage">
      <h2>{`${city}`}</h2>
      {weatherData && forecastData ? (
        <div>
          <div className="today">
            <div className='currentTemp'>
              <img src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`} alt={weatherData.weather[0].description} style={{ width: '120px', height: '120px' }} />
              <p>{Math.round(weatherData.main.temp)}&deg;</p>
            </div>
            <h3>{getCustomWeatherDescription(weatherData.weather[0].description)}</h3>
            <div className='temp'>
              <p>최저 : {Math.round(minMaxTemp.minTemp)}&deg;</p>
              <p>최고 : {Math.round(minMaxTemp.maxTemp)}&deg;</p>
            </div>
            <div className="hour">
            <div className="scroll-container">
            {
          forecastData.list
            .filter((forecast) => forecast.dt * 1000 >= now && forecast.dt * 1000 <= twentyFourHoursLater) // 현재 시간과 24시간 이후의 데이터만 필터링
            .map((forecast, index) => (
              <div key={index} className="forecast">
                <p><strong>{new Date(forecast.dt * 1000).toLocaleTimeString([], { hour: '2-digit', hour12: false })}</strong></p>
                <img src={`https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`} alt={forecast.weather[0].description} style={{ width: '50px', height: '50px' }} />
                <p>{Math.round(forecast.main.temp)}&deg;C </p>
              </div>
            ))
            }
      </div>
    </div>
          </div>
          <div className="week">
            {
              forecastData.list.filter((_, index) => index % 8 === 0).map((forecast, index) => {
                const forecastDate = new Date(forecast.dt * 1000); // 예보 날짜
                const isToday = forecastDate.toDateString() === new Date().toDateString(); // 오늘인지 확인
                const options = { weekday: 'long' }; // 요일 포맷 설정
                const displayDate = isToday ? '오늘' : forecastDate.toLocaleDateString(undefined, options); // 오늘은 '오늘', 나머지는 요일로 표시
                return (
                  <div key={index} className="forecast">
                    <div className="day">
                      <p><strong>{displayDate}</strong></p>
                      <p>{new Date(forecast.dt * 1000).toLocaleDateString(undefined, { month: '2-digit', day: '2-digit' })}</p>
                    </div>
                    <img src={`https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`} alt={weatherData.weather[0].description} style={{ width: '50px', height: '50px' }} />
                    <p>{Math.round(forecast.main.temp_min)}&deg;</p>
                    <p>{Math.round(forecast.main.temp_max)}&deg;</p>
                  </div>
                )
              })
            }
          </div>
        </div>
      ) : (
        <div className="loading">
          <LoadingSpinner />
          <p>날씨 정보를 불러오는 중입니다...</p>
        </div>
      )}
      <Button onClick={backMove} className="more">뒤로</Button>
    </Container>
    </div>
  );
}


export default WeatherPage;