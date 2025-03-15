import axios from "axios";
import { ApiResponse, Character } from "../_types/types";

const BASE_URL = "https://rickandmortyapi.com/api";

const getCharacters = async (): Promise<ApiResponse> => {
  const response = await axios.get<ApiResponse>(`${BASE_URL}/character`);
  return response.data;
};

const getCharacter = async (id?: string): Promise<Character | null> => {
  if (!id) return null;

  try {
    const response = await axios.get<Character>(`${BASE_URL}/character/${id}`);
    if (!response.data) return null;
    return response.data;
  } catch (error) {
    return null;
  }
};

export { getCharacters, getCharacter };
