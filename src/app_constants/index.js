export const APP_ROUTES = {
  LIST_PERSON: "/",
  CREATE_PERSON: "/person/create/",
  UPDATE_PERSON: "/person/update/:id/",
  GET_PERSON: "/person/get/:id/",
};

export const MANAGE_PERSON_BACKEND_URL =
  process.env.REACT_APP_MANAGE_PERSON_BACKEND_URL;

export const APIS_ROUTES = {
  API_LIST: `${MANAGE_PERSON_BACKEND_URL}/person/list/`,
  API_CREATE: `${MANAGE_PERSON_BACKEND_URL}/person/create/`,
  API_UPDATE: `${MANAGE_PERSON_BACKEND_URL}/person/update/:id/`,
  API_GET: `${MANAGE_PERSON_BACKEND_URL}/person/get/:id/`,
  API_DELETE: `${MANAGE_PERSON_BACKEND_URL}/person/delete/:id/`,
};
