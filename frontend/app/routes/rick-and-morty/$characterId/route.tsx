import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, type MetaFunction } from "@remix-run/react";
import { getCharacter } from "../_services/rick-and-morty.service";
import { CharacterDetails } from "../_features/character/character-details";
import { motion } from "framer-motion";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data?.character) {
    return [
      { title: "Character Not Found | Rick and Morty" },
      { description: "Character not found" },
    ];
  }

  return [
    { title: `${data.character.name} | Rick and Morty` },
    {
      description: `Learn more about ${data.character.name} from Rick and Morty series`,
    },
    { property: "og:title", content: data.character.name },
    { property: "og:image", content: data.character.image },
  ];
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const character = await getCharacter(params.characterId);

  if (!character) {
    throw new Response("Character not found", { status: 404 });
  }

  return json({ character });
};

const CharacterPage = () => {
  const { character } = useLoaderData<typeof loader>();

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransitionVariants}
    >
      <CharacterDetails character={character} />
    </motion.div>
  );
};

export default CharacterPage;

const pageTransitionVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.3 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2 },
  },
};
