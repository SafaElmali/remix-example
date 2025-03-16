import { FC } from "react";
import type { Location } from "@/routes/rick-and-morty/_types/types";

type CharacterLocationProps = {
  location: Location;
};

const CharacterLocation: FC<CharacterLocationProps> = ({ location }) => {
  return <p className="text-gray-600">Location: {location.name}</p>;
};

export { CharacterLocation };
