import { useEffect, useState } from "react";
import "./App.css";

// https://api.frankfurter.app/latest?amount=100&from=EUR&to=USD
const apiUrl = "https://api.frankfurter.app/latest";

function App() {
  const [input, setInput] = useState(1);
  const [selectCurrency, setSelectCurrenty] = useState("EUR");
  const [convertedCurrency, setConvertedCurrency] = useState("USD");
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(
    function () {
      const controller = new AbortController();

      async function currencyConverter() {
        try {
          setIsLoading(true);
          setError("");

          const res = await fetch(
            `${apiUrl}?amount=${input}&from=${selectCurrency}&to=${convertedCurrency}`,
            { signal: controller.signal }
          );
          if (!res.ok)
            throw new Error("Fetching error, please check your connection");

          const data = await res.json();
          // console.log(data.rates[convertedCurrency]);
          setOutput(data.rates[convertedCurrency]);
        } catch (err) {
          if (err.name !== "AbortError") {
            setError(err.message);
          }
        } finally {
          setIsLoading(false);
        }
      }

      if (selectCurrency === convertedCurrency) return setOutput(input);
      currencyConverter();

      return function () {
        controller.abort();
      };
    },
    [input, selectCurrency, convertedCurrency]
  );

  console.log(output);
  return (
    <div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(Number(e.target.value))}
        disabled={isLoading}
      />
      <select
        value={selectCurrency}
        onChange={(e) => setSelectCurrenty(e.target.value)}
        disabled={isLoading}
      >
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="CAD">CAD</option>
        <option value="INR">INR</option>
      </select>
      <select
        value={convertedCurrency}
        onChange={(e) => setConvertedCurrency(e.target.value)}
        disabled={isLoading}
      >
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="CAD">CAD</option>
        <option value="INR">INR</option>
      </select>
      {isLoading ? (
        <Loader />
      ) : error ? (
        { error }
      ) : (
        <p>
          {output} {convertedCurrency}
        </p>
      )}
    </div>
  );
}

function Loader() {
  return <p>Loading..</p>;
}

export default App;
