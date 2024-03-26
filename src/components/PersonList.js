import React, { useState, useEffect } from "react";
import axios from "axios";
import DataTableView from "components/DataTableView";
import Title from "components/Title";
import { Button } from "primereact/button";
import { useNavigate } from "react-router";
import { APIS_ROUTES, APP_ROUTES } from "app_constants";
import SearchView from "components/SearchView";

function PersonList() {
  const [params, setParams] = useState(null);
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleParamsChange = (newParams) => {
    setParams(newParams);
  };

  function objectToQueryString(obj) {
    const queryString = [];
    for (const key in obj) {
      if (
        obj[key] === "" ||
        obj[key] === null ||
        obj[key] === undefined ||
        obj[key] === 0
      )
        continue;

      queryString.push(
        `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`
      );
    }

    return `?${queryString.join("&")}`;
  }

  useEffect(() => {
    const fetchPeople = async () => {
      const queryString = objectToQueryString(params);
      try {
        const response = await axios.get(
          `${APIS_ROUTES.API_LIST}${queryString}`
        );
        setPeople(response.data);
        setLoading(false);
      } catch (error) {
        setError("Error fetching data");
        setLoading(false);
      }
    };

    fetchPeople();
  }, [params]);

  if (loading) {
    return (
      <div className="card justify-content-center">
        <Title title="Carregando...." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="card justify-content-center">
        <Title title={error} />
      </div>
    );
  }

  return (
    <div>
      <SearchView handleParamsChange={handleParamsChange} />
      <div style={{ textAlign: "right" }}>
        <Button
          severity="primary"
          onClick={(e) => navigate(APP_ROUTES.CREATE_PERSON)}
          className="md:col-2 sm:col-6 m-1"
          label="Cadastrar Pessoa"
        />
      </div>
      <DataTableView data={people} />
    </div>
  );
}

export default PersonList;
