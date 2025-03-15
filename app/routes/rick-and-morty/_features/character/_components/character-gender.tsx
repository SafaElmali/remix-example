import { FC } from "react";

type CharacterGenderProps = {
  gender: string;
};

const CharacterGender: FC<CharacterGenderProps> = ({ gender }) => {
  return <p className="text-gray-600">Gender: {gender}</p>;
};

export { CharacterGender };
