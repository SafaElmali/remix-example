import { FC } from "react";
import { Image } from "@/components/features/image";
import type { Location } from "@/routes/rick-and-morty/_types/types";

type CharacterImageProps = {
  src: string;
  alt: string;
  className?: string;
};

const CharacterImage: FC<CharacterImageProps> = ({ src, alt, className }) => {
  return <Image src={src} alt={alt} className={className} />;
};

type CharacterNameProps = {
  name: string;
};

const CharacterName: FC<CharacterNameProps> = ({ name }) => {
  return <h2 className="font-bold text-lg">{name}</h2>;
};

type CharacterStatusProps = {
  status: string;
};

const CharacterStatus: FC<CharacterStatusProps> = ({ status }) => {
  return <p className="text-gray-600">Status: {status}</p>;
};

type CharacterSpeciesProps = {
  species: string;
};

const CharacterSpecies: FC<CharacterSpeciesProps> = ({ species }) => {
  return <p className="text-gray-600">Species: {species}</p>;
};

type CharacterLocationProps = {
  location: Location;
};

const CharacterLocation: FC<CharacterLocationProps> = ({ location }) => {
  return <p className="text-gray-600">Location: {location.name}</p>;
};

type CharacterGenderProps = {
  gender: string;
};

const CharacterGender: FC<CharacterGenderProps> = ({ gender }) => {
  return <p className="text-gray-600">Gender: {gender}</p>;
};

type CharacterOriginProps = {
  origin: Location;
};

const CharacterOrigin: FC<CharacterOriginProps> = ({ origin }) => {
  return <p className="text-gray-600">Origin: {origin.name}</p>;
};

export {
  CharacterImage,
  CharacterName,
  CharacterStatus,
  CharacterSpecies,
  CharacterLocation,
  CharacterGender,
  CharacterOrigin,
};
