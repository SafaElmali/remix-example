import { FC } from "react";
import type { Character } from "@/routes/rick-and-morty/_types/types";
import { CharacterStatus } from "./_components/character-status";
import { CharacterImage } from "./_components/character-image";
import { CharacterName } from "./_components/character-name";
import { CharacterLocation } from "./_components/character-location";
import { CharacterGender } from "./_components/character-gender";
import { CharacterSpecies } from "./_components/character-species";
import { CharacterOrigin } from "./_components/character-origin";
import { motion } from "framer-motion";
import { Link } from "@remix-run/react";
import UrlUtil from "@/lib/urls";
import { ChevronLeft } from "lucide-react";

type CharacterDetailsProps = {
  character: Character;
};

const CharacterDetails: FC<CharacterDetailsProps> = ({ character }) => {
  return (
    <motion.div
      className="p-6 max-w-4xl mx-auto"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div className="mb-6" variants={itemVariants}>
        <Link
          to={UrlUtil.buildRickAndMortyUrl()}
          className="text-blue-500 hover:text-blue-700 transition-colors flex items-center"
        >
          <ChevronLeft className="mr-2" />
          Back to Characters
        </Link>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        <motion.div variants={imageVariants}>
          <CharacterImage
            src={character.image}
            alt={character.name}
            className="rounded-lg shadow-lg w-full md:w-96 h-auto"
          />
        </motion.div>

        <motion.div className="space-y-4" variants={infoVariants}>
          <motion.div variants={itemVariants}>
            <CharacterName name={character.name} />
          </motion.div>

          <div className="grid gap-2">
            <motion.div variants={itemVariants}>
              <CharacterStatus status={character.status} />
            </motion.div>

            <motion.div variants={itemVariants}>
              <CharacterSpecies species={character.species} />
            </motion.div>

            <motion.div variants={itemVariants}>
              <CharacterGender gender={character.gender} />
            </motion.div>

            <motion.div variants={itemVariants}>
              <CharacterOrigin origin={character.origin} />
            </motion.div>

            <motion.div variants={itemVariants}>
              <CharacterLocation location={character.location} />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export { CharacterDetails };

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
};

const imageVariants = {
  hidden: { x: -50, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

const infoVariants = {
  hidden: { x: 50, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
    },
  },
};
