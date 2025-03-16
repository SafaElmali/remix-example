import axios from "axios";
import { ApiResponse, Character } from "../_types/types";

const BASE_URL = "https://rickandmortyapi.com/api";

const getCharacters = async (search?: string): Promise<ApiResponse> => {
  const url = new URL(`${BASE_URL}/character`);
  if (search) {
    url.searchParams.set("name", search);
  }

  const response = await axios.get<ApiResponse>(url.toString());

  if (response.status !== 200) {
    // Return empty results for no matches
    if (response.status === 404) {
      return {
        results: [],
        info: { count: 0, pages: 0, next: null, prev: null },
      };
    }
    throw new Error("Failed to fetch characters");
  }
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
