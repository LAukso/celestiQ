import axios from "axios";

const API_BASE_URL = "https://hstc-api.testing.keyholding.com/";
const API_KEY = "94962B9A-966C-43FC-8E1A-145DEAA5970C";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "x-api-key": API_KEY,
  },
});
