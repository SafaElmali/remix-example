import axios from "axios";

export interface About {
  id: number;
  title: string;
  description: string;
  content: string;
  created_at: string;
  updated_at: string;
}

/**
 * Fetches the About page details from the API
 * @returns Promise with the About page data
 */
export const getAboutDetails = async (): Promise<About> => {
  const response = await axios.get('http://localhost:3001/api/v1/about');
  return response.data;
};

/**
 * Updates the About page details
 * @param id - The ID of the About page record
 * @param data - The updated About page data
 * @returns Promise with the updated About page data
 */
export const updateAboutDetails = async (
  id: number,
  data: Partial<About>
): Promise<About> => {
  const response = await axios.put(`http://localhost:3001/api/v1/about/${id}`, {
    about: data
  }, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
  return response.data;
};
