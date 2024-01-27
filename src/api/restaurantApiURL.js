export const BASE_URL_UNSECURE = "https://ufoodapi.herokuapp.com/unsecure";
export const BASE_URL = "https://ufoodapi.herokuapp.com";

export function getUserToken() {
  const userToken = localStorage.getItem("authToken");
  if (userToken) {
    return userToken;
  }
  return null;
}

