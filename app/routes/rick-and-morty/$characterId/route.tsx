import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, type MetaFunction } from "@remix-run/react";
import { getCharacter } from "@/routes/rick-and-morty/_services/rick-and-morty.service";
import { CharacterDetails } from "@/routes/rick-and-morty/_features/character/character-details";

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
  return <CharacterDetails character={character} />;
};

export default CharacterPage;
