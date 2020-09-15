import React, { useEffect, useState, ChangeEvent } from "react";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import InfoBox from "./components/InfoBox";
import Map from "./components/Map";

import MenuItem from "@material-ui/core/MenuItem";
import {
  getCountries,
  getCovidInfo,
  getCovidInfoByCountryCode,
} from "./services/api";

import "./App.scss";

interface Country {
  name: string;
  value: string;
}

interface CountryListResponse {
  country: string;
  countryInfo: { iso3: string };
}

interface CovidInfo {
  updated: number;
  country: string;
  countryInfo: {
    _id: number;
    iso2: string;
    iso3: string;
    lat: number;
    long: number;
    flag: string;
  };
  cases: number;
  todayCases: number;
  deaths: number;
  todayDeaths: number;
  recovered: number;
  todayRecovered: number;
  active: number;
  critical: number;
  casesPerOneMillion: number;
  deathsPerOneMillion: number;
  tests: number;
  testsPerOneMillion: number;
  population: number;
  continent: string;
  oneCasePerPeople: number;
  oneDeathPerPeople: number;
  oneTestPerPeople: number;
  activePerOneMillion: number;
  recoveredPerOneMillion: number;
  criticalPerOneMillion: number;
}

function App() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [country, setCountry] = useState<string>(""); // https://material-ui.com/guides/typescript/
  const [covidInfo, setCovidInfo] = useState({});

  useEffect(() => {
    const getCountriesList = async () => {
      const response: CountryListResponse[] = await getCountries();

      const countryList = response.map((country: CountryListResponse) => ({
        name: country.country,
        value: country.countryInfo.iso3,
      }));

      countryList.unshift({ name: "Woldwide", value: "worldWide" });

      setCountries(countryList);
      setCountry("worldWide");
    };

    getCountriesList();
  }, []);

  const onCountryChange = async (
    event: ChangeEvent<{
      name?: string | undefined;
      value: unknown;
    }>
  ) => {
    const countryCode = event.target.value as string; // https://github.com/mui-org/material-ui/issues/16065

    let response;
    if (countryCode === "worldWide") {
      response = await getCovidInfo();
    } else {
      response = await getCovidInfoByCountryCode(countryCode);
    }
    setCovidInfo(response);
    console.log("checking response", response);
    setCountry(event.target.value as string);
  };

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>Covid 19 tracker</h1>
          <FormControl className="app__drop-down" variant="outlined">
            {/* <InputLabel id="demo-simple-select-label">Country</InputLabel> */}
            <Select onChange={onCountryChange} value={country}>
              {countries.map((country: Country, index: number) => {
                console.log(country);
                return (
                  <MenuItem key={index.toString()} value={country.value}>
                    {country.name}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </div>
        <div className="app__stats">
          <InfoBox title="Coronavirus cases" cases={123} total={234} />
          <InfoBox title="Recovered" cases={123} total={234} />
          <InfoBox title="Deaths" cases={123} total={234} />
        </div>
        <Map />
      </div>
      <Card className="app__right">
        <CardContent>
          <h3>Live cases by country</h3>
          <h3>asd</h3>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
