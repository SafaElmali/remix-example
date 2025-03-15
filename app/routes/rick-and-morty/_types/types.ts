export type Character = {
  id: number;
  name: string;
  status: "Alive" | "Dead" | "Unknown";
  species: string;
  type: string;
  gender: string;
  origin: Location;
  location: Location;
  image: string;
  episode: string[];
  url: string;
  created: string;
};

export type Location = {
  name: string;
  url: string;
};

export type ApiResponse = {
  info: {
    count: number;
    pages: number;
    next: string | null;
    prev: string | null;
  };
  results: Character[];
};
