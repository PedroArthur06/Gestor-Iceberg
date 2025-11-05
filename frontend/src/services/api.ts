import axios from "axios";
import { Orcamento } from "../types";

// Se estiver no emulador Android, use:
const API_URL = "http://192.168.0.52/api";
// Se for no emulador iOS ou dispositivo (mesma rede), use o IP da sua máquina:
// const API_URL = 'http://192.168.1.10:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

// O Mongoose já está mapeando _id para id no backend (toJSON),
// então não precisamos de interceptors.

export default api;
