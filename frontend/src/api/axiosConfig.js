import apiAxios from "../api/axiosConfig";

const equipoService = {
  getEquipos: async () => {
    const res = await apiAxios.get("/equipos");
    return res.data; // <-- debe ser un array
  }
};

export default equipoService;
