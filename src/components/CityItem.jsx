import { Link } from "react-router-dom";
import styles from "./CityItem.module.css";
// import { useEffect, useState } from "react";
import { useCities } from "../contexts/CitiesContext";
import { useCountryFlag } from "../hooks/useCountryFlag";

const formatDate = (date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));

function CityItem({ city }) {
  const { cityName, date, emoji, id, position } = city;
  const { currentCity, deleteCity } = useCities();
  const { country, flag, loading, error } = useCountryFlag(city.country);

  function handleClick(e) {
    e.preventDefault();
    deleteCity(id);
  }

  return (
    <li>
      <Link
        className={`${styles.cityItem} ${
          id === currentCity.id && styles["cityItem--active"]
        }`}
        to={`${id}?lat=${position.lat}&lng=${position.lng}`}
      >
        {!error && !loading && flag ? (
          <img src={flag} alt={country} className={styles.emoji} />
        ) : (
          <span className={styles.emoji}>{emoji}</span>
        )}
        <h3 className={styles.name}>{cityName}</h3>
        <time className={styles.date}>( {formatDate(date)} )</time>
        <button className={styles.deleteBtn} onClick={handleClick}>
          &times;
        </button>
      </Link>
    </li>
  );
}

export default CityItem;
