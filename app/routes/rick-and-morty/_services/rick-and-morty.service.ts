import axios from "axios";
import { ApiResponse } from "../_types/types";

const BASE_URL = "https://rickandmortyapi.com/api";

const getCharacters = async () => {
  const response = await axios.get<ApiResponse>(`${BASE_URL}/character`);
  return response.data;
};

export { getCharacters };
