import { json, type LoaderFunctionArgs } from "@remix-run/node";
import {
  MetaFunction,
  useLoaderData,
  useSearchParams,
  useSubmit,
  Form,
} from "@remix-run/react";
import { CharacterCard } from "./_features/character/character-card";
import { getCharacters } from "./_services/rick-and-morty.service";
import { useDebounce } from "@/hooks/use-debounce";
import { Input } from "@/components/ui/input";

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

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const search = url.searchParams.get("search") || "";
  const characters = await getCharacters(search);
  return json({ characters, search });
};

const RickAndMortyPage = () => {
  const { characters, search } = useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();
  const submit = useSubmit();

  // Debounce search input to avoid too many requests
  const debouncedSubmit = useDebounce((form: HTMLFormElement) => {
    submit(form);
  }, 300);

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isFirstSearch = searchParams.get("search") === null;
    setSearchParams({ search: e.target.value }, { replace: isFirstSearch });
    debouncedSubmit(e.currentTarget.form!);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        Rick and Morty Characters
        {search && (
          <span className="text-gray-500 ml-2">
            searching for &quot;{search}&quot;
          </span>
        )}
      </h1>

      <div className="max-w-xl mb-8">
        <Form method="get" className="relative">
          <Input
            type="search"
            name="search"
            placeholder="Search characters..."
            defaultValue={search}
            onChange={onSearchChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </Form>
      </div>

      {characters.results.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No characters found matching &quot;{search}&quot;
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {characters.results.map((character) => (
            <CharacterCard key={character.id} character={character} />
          ))}
        </div>
      )}
    </div>
  );
};

export default RickAndMortyPage;
