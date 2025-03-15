import { FC } from "react";

type CharacterNameProps = {
  name: string;
};

const CharacterName: FC<CharacterNameProps> = ({ name }) => {
  return <h2 className="font-bold text-lg">{name}</h2>;
};

export { CharacterName };
