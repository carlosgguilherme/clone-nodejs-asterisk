import Cookies from "js-cookie";

function getAuthToken() {
  return Cookies.get("token");
}
