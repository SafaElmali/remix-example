import { FC } from "react";
import type { Character } from "@/routes/rick-and-morty/_types/types";
import { CharacterStatus } from "./_components/character-status";
import { CharacterImage } from "./_components/character-image";
import { CharacterName } from "./_components/character-name";
import { CharacterLocation } from "./_components/character-location";
import { CharacterGender } from "./_components/character-gender";
import { CharacterSpecies } from "./_components/character-species";
import { CharacterOrigin } from "./_components/character-origin";

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
