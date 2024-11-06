import React, { useState } from 'react';

const cityMapping = {
  '서울특별시': 'Seoul',
  '인천광역시': 'Incheon',
  '수원시': 'Suwon-si',
  '성남시': 'Seongnam-si',
  '고양시': 'Goyang-si',
  '부산광역시': 'Busan',
  '대구광역시': 'Daegu',
  '광주광역시': 'Gwangju',
  '대전광역시': 'Daejeon',
  '울산광역시': 'Ulsan',
  '세종특별자치시': 'Sejong'
};

function CitySelector({ onCitySelect, onInputClick }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCities, setFilteredCities] = useState([]);

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);

    if (value) {
      const filtered = Object.keys(cityMapping).filter(city =>
        city.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredCities(filtered);
    } else {
      setFilteredCities([]);
    }
  };

  const selectCity = (city) => {
    setSearchTerm(city);
    setFilteredCities([]);
    onCitySelect(city);
  };

  return (
    <div className="search">
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearchChange}
        onClick={onInputClick}
        placeholder="도시 검색"
      />
      {filteredCities.length > 0 && (
        <ul>
          {filteredCities.map((city, index) => (
            <li key={index} onClick={() => selectCity(city)}>
              {city}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CitySelector;