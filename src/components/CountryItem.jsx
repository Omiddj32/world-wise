import { useCountryFlag } from "../hooks/useCountryFlag";
import styles from "./CountryItem.module.css";
import Spinner from "./Spinner";

function CountryItem({ countryName }) {
  const { country, flag, loading, error } = useCountryFlag(countryName.country);

  if (loading) return <Spinner />;

  return (
    <li className={styles.countryItem}>
      {!error && !loading && flag ? (
        <img src={flag} alt={country} className={styles.emoji} />
      ) : (
        <span className={styles.emoji}>{countryName.emoji}</span>
      )}
      <span>{countryName.country}</span>
    </li>
  );
}

export default CountryItem;
