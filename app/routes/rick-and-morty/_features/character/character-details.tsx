import { FC } from "react";
import type { Character } from "@/routes/rick-and-morty/_types/types";
import {
  CharacterGender,
  CharacterImage,
  CharacterLocation,
  CharacterName,
  CharacterOrigin,
  CharacterSpecies,
  CharacterStatus,
} from "./_components";

interface CharacterDetailsProps {
  character: Character;
}

const CharacterDetails: FC<CharacterDetailsProps> = ({ character }) => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <CharacterImage
          src={character.image}
          alt={character.name}
          className="rounded-lg shadow-lg w-full md:w-96 h-auto"
        />
        <div className="space-y-4">
          <CharacterName name={character.name} />
          <div className="grid gap-2">
            <CharacterStatus status={character.status} />
            <CharacterSpecies species={character.species} />
            <CharacterGender gender={character.gender} />
            <CharacterOrigin origin={character.origin} />
            <CharacterLocation location={character.location} />
          </div>
        </div>
      </div>
    </div>
  );
};

export { CharacterDetails };
