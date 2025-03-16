import { FC } from "react";

type CharacterSpeciesProps = {
  species: string;
};

const CharacterSpecies: FC<CharacterSpeciesProps> = ({ species }) => {
  return <p className="text-gray-600">Species: {species}</p>;
};

export { CharacterSpecies };
