import axios from "axios";

const Axios = axios.create({
  baseURL:"https://bridge-backend.enedex.org/",
  
});

export default Axios;
