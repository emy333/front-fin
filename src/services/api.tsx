import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://back-finfacil.mariaemelly.com.br',
        // baseURL: 'http://localhost:8080/',

})

export default axiosInstance;
