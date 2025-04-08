import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://back-finfacil.mariaemelly.com.br',
})

export default axiosInstance;
