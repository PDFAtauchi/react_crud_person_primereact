import React from "react";
import { Routes, Route } from "react-router-dom";

import PersonList from "components/PersonList";
import PersonCreate from "components/PersonCreate";
import PersonUpdate from "components/PersonUpdate";
import { APP_ROUTES } from "app_constants";

export default function PublicRoutes() {
  return (
    <Routes>
      <Route path={APP_ROUTES.LIST_PERSON} element={<PersonList />} />
      <Route path={APP_ROUTES.CREATE_PERSON} element={<PersonCreate />} />
      <Route path={APP_ROUTES.UPDATE_PERSON} element={<PersonUpdate />} />
    </Routes>
  );
}
