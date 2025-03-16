import { FC } from "react";
import type { Location } from "@/routes/rick-and-morty/_types/types";

type CharacterOriginProps = {
  origin: Location;
};

const CharacterOrigin: FC<CharacterOriginProps> = ({ origin }) => {
  return <p className="text-gray-600">Origin: {origin.name}</p>;
};

export { CharacterOrigin };
