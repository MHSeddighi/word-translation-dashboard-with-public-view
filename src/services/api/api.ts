import axios, { AxiosInstance } from "axios";
import { toast } from "react-toastify";

const API_URL = "https://get.taaghche.com";

const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// apiClient.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     return Promise.reject(error);
//   }
// );

function handleErrors(error) {
  if (typeof window !== "undefined") {
    if (!navigator.onLine) {
      toast.error("You are offline. Please check your internet connection.");
    } else if (error.message === "Network Error") {
      toast.error("Network error occurred. Please check your connection.");
    } else if (error.code === "ECONNABORTED") {
      toast.error("The request timed out. Please try again.");
    } else {
      throw error;
    }
  } else {
    throw error;
  }
}

export const fetchData = async (
  endpoint: string,
  params = {},
  { retryCount = 1, delay = 1000 } = {}
) => {
  let attempt = 0;

  while (attempt < retryCount) {
    try {
      const response = await apiClient.get(endpoint, { params: params });
      return response?.data;
    } catch (error) {
      attempt++;
      if (attempt >= retryCount) {
        handleErrors(error);
      } else {
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }
};

export default apiClient;
