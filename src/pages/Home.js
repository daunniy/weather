import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CitySelector from '../components/CitySelector';
import styled from 'styled-components';

const Container = styled.div`
  text-align: center;
`;

function Home() {
  const navigate = useNavigate();
  const [selectedCity, setSelectedCity] = useState('');
  const [isHeadingVisible, setIsHeadingVisible] = useState(true);
  const [isInputMoving, setIsInputMoving] = useState(false);

  useEffect(() => {
    const savedCity = localStorage.getItem('selectedCity');
    if (savedCity) {
      setSelectedCity(savedCity);
    }
  }, []);

  const citySelect = (city) => {
    setSelectedCity(city);
    localStorage.setItem('selectedCity', city);
    navigate(`/${city}`);
  };

  const handleInputClick = () => {
    setIsHeadingVisible(false); // input 클릭 시 h1 숨기기
    setIsInputMoving(true); // input 이동 시작
  };

  return (
    <Container className="home">
      {isHeadingVisible && (
        <h1 className={`heading`}>
          날씨
        </h1>
      )}
      <div className={`input-container ${isInputMoving ? 'input-move-up' : ''}`}>
        <CitySelector onCitySelect={citySelect} onInputClick={handleInputClick} />
      </div>
    </Container>
  );
}

export default Home;