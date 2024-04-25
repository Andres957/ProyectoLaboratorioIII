
import axios from "axios";
const apiClient = axios.create({
  baseURL: " https://laboratorio3-5fc7.restdb.io/rest/",
  headers: { 'x-apikey': ' 64bdbc3386d8c5613ded91e7' },
  
});


export default apiClient;
