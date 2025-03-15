import { FC } from "react";
import { Link } from "@remix-run/react";
import type { Character } from "@/routes/rick-and-morty/_types/types";
import {
  CharacterImage,
  CharacterName,
  CharacterStatus,
  CharacterSpecies,
  CharacterLocation,
} from "./_components";

type CharacterCardProps = {
  character: Character;
};

const CharacterCard: FC<CharacterCardProps> = ({ character }) => {
  return (
    <Link 
      to={`/rick-and-morty/${character.id}`}
      className="block border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1"
    >
      <CharacterImage
        src={character.image}
        alt={character.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <CharacterName name={character.name} />
        <CharacterStatus status={character.status} />
        <CharacterSpecies species={character.species} />
        <CharacterLocation location={character.location} />
      </div>
    </Link>
  );
};

export { CharacterCard };