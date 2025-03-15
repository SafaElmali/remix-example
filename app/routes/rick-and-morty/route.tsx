import { json } from "@remix-run/node";
import { MetaFunction, useLoaderData } from "@remix-run/react";
import { CharacterCard } from "./_features/character/character-card";
import { getCharacters } from "./_services/rick-and-morty.service";

export const meta: MetaFunction = () => {
  return [
    { title: "Rick and Morty Characters | My App" },
    {
      name: "description",
      content: "Browse characters from Rick and Morty series",
    },
    { property: "og:title", content: "Rick and Morty Characters" },
    {
      property: "og:description",
      content: "Explore all characters from Rick and Morty universe",
    },
    { name: "robots", content: "index,follow" },
    { name: "viewport", content: "width=device-width,initial-scale=1" },
  ];
};

export const loader = async () => {
  const characters = await getCharacters();
  return json({ characters });
};

const RickAndMortyPage = () => {
  const { characters } = useLoaderData<typeof loader>();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Rick and Morty Characters</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {characters.results.map((character) => (
          <CharacterCard key={character.id} character={character} />
        ))}
      </div>
    </div>
  );
};

export default RickAndMortyPage;
