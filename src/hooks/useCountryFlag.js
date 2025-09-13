import { useEffect, useReducer } from "react";

const initialState = {
  flag: null,
  country: null,
  loading: false,
  error: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, loading: true, error: null };

    case "city/flag":
      return { ...state, loading: false, flag: action.payload, error: null };

    case "city/country":
      return { ...state, loading: false, country: action.payload, error: null };

    case "rejected":
      return {
        ...state,
        loading: false,
        flag: null,
        country: null,
        error: action.payload,
      };

    default:
      throw new Error("Unknown action type");
  }
}

export function useCountryFlag(countryName) {
  const [{ flag, country, loading, error }, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(() => {
    if (!countryName) return;

    async function fetchCountry() {
      dispatch({ type: "loading" });

      try {
        const res = await fetch(
          `https://restcountries.com/v3.1/name/${countryName}?fullText=true`
        );

        if (!res.ok) throw new Error("Country not found");

        const data = await res.json();
        // console.log(data);

        dispatch({ type: "city/country", payload: data[0].name.common });
        dispatch({ type: "city/flag", payload: data[0].flags.svg });
      } catch (err) {
        dispatch({ type: "rejected", payload: err.message });
      }
    }

    fetchCountry();
  }, [countryName]);

  return { country, flag, loading, error };
}
