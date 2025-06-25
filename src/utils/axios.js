import axios from "axios";

//
import { BASE_URL } from "../config";

//BASE URL => http://localhost:3000

const axiosInstance = axios.create({ baseURL: BASE_URL });

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(
        (error.response && error.response.data) || "Something went wrong"
    )
);

export default axiosInstance;