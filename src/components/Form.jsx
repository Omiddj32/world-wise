// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import Button from "./Button";
import BackButton from "./BackButton";

import styles from "./Form.module.css";
import { useUrlPosition } from "../hooks/useUrlPosition";
import { useCountryFlag } from "../hooks/useCountryFlag";
import Message from "./Message";
import Spinner from "./Spinner";
import { useCities } from "../contexts/CitiesContext";
import { useNavigate } from "react-router-dom";

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

function Form() {
  const [lat, lng] = useUrlPosition();
  const { createCity, isLoading } = useCities();
  const navigate = useNavigate();

  const [isLoadingGeocoding, setIsLoadingGeocoding] = useState(false);
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [emoji, setEmoji] = useState("");
  const [geocodingError, setGeocodingError] = useState(null);
  const {
    country: countryName,
    flag,
    loading,
    error: errorFlag,
  } = useCountryFlag(country);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!cityName || !date) return;

    const newCity = {
      cityName,
      country,
      flag,
      emoji,
      date,
      notes,
      position: { lat, lng },
    };

    // because createCity is async fun we use await
    await createCity(newCity);
    navigate("/app/cities");
  }

  const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";

  function editSomeCountryName(data) {
    if (data.countryCode === "TR") setCountry("Turkey");
    if (data.countryCode === "CD") setCountry("Republic of the Congo");
    if (data.countryCode === "TZ") setCountry("United Republic of Tanzania");
    if (data.countryCode === "KR") setCountry("south korea");
    if (data.countryCode === "KP") setCountry("North korea");
  }

  useEffect(
    function () {
      if (!lat && !lng) return;

      async function fetchCityData() {
        try {
          setIsLoadingGeocoding(true);
          setGeocodingError(null);

          const res = await fetch(
            `${BASE_URL}?latitude=${lat}&longitude=${lng}`
          );
          const data = await res.json();
          // console.log(data);

          if (!data.countryCode)
            throw new Error(
              "That doesn't seem to be a city. Click somewhere else 🐦‍⬛"
            );

          setCityName(data.city || data.locality || "");
          setEmoji(convertToEmoji(data.countryCode));

          //this is split is for get currect name of countries
          setCountry(data.countryName.split("(")[0].trim());

          // edit some country name to find the flag
          editSomeCountryName(data);
        } catch (err) {
          setGeocodingError(err.message);
        } finally {
          setIsLoadingGeocoding(false);
        }
      }

      fetchCityData();
    },
    [lat, lng]
  );

  if (isLoadingGeocoding) return <Spinner />;

  if (!lat && !lng)
    return <Message message="Start by clicking somewhere on the map" />;

  if (geocodingError) return <Message message={geocodingError} />;

  return (
    <form
      className={`${styles.form} ${isLoading ? styles.loading : ""}`}
      onSubmit={handleSubmit}
    >
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        {/* <span className={styles.flag}>{emoji}</span> */}
        {loading && <span className={styles.flag}>loading...</span>}
        {errorFlag && (
          <span
            className={styles.flag}
            style={{
              width: "40%",
              right: "0",
            }}
          >
            can't find flag🚩
          </span>
        )}
        {!errorFlag && !loading && flag && (
          <img src={flag} alt={countryName} className={styles.flag} />
        )}
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>

        <DatePicker
          id="date"
          onChange={(date) => setDate(date)}
          selected={date}
          dateFormat="dd/MM/yyyy"
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary">Add</Button>

        <BackButton />
      </div>
    </form>
  );
}

export default Form;
