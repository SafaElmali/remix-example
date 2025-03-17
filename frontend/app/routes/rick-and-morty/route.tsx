import { json, type LoaderFunctionArgs } from "@remix-run/node";
import {
  MetaFunction,
  useLoaderData,
  useSearchParams,
  useSubmit,
  Form,
  useNavigation,
} from "@remix-run/react";
import { CharacterCard } from "./_features/character/character-card";
import { getCharacters } from "./_services/rick-and-morty.service";
import { useDebounce } from "@/hooks/use-debounce";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import type { Character } from "./_types/types";
import { motion, AnimatePresence } from "framer-motion";

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

type LoaderData = {
  characters: { results: Character[] };
  search: string;
  error: string | null;
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  try {
    const search = url.searchParams.get("search") || "";
    const characters = await getCharacters(search);
    return json({ characters, search, error: null });
  } catch (error) {
    return json({
      characters: { results: [] },
      search: url.searchParams.get("search") || "",
      error: "Failed to fetch characters",
    });
  }
};

const RickAndMortyPage = () => {
  const { characters, search, error } = useLoaderData<
    typeof loader
  >() as LoaderData;
  const [searchParams, setSearchParams] = useSearchParams();
  const [inputValue, setInputValue] = useState(search || "");
  const submit = useSubmit();
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";

  // Update input value when search parameter changes (e.g., when navigating)
  useEffect(() => {
    setInputValue(search || "");
  }, [search]);

  const debouncedSubmit = useDebounce((value: string) => {
    const isFirstSearch = searchParams.get("search") === null;
    setSearchParams({ search: value }, { replace: isFirstSearch });

    // Create and submit a form with the debounced value
    const formData = new FormData();
    formData.append("search", value);
    submit(formData, { method: "get", replace: true });
  }, 500);

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    debouncedSubmit(newValue);
  };

  return (
    <motion.div
      className="p-6"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={containerVariants}
    >
      <motion.h1 className="text-2xl font-bold mb-6" variants={itemVariants}>
        Rick and Morty Characters
        {search && (
          <span className="text-gray-500 ml-2">
            searching for &quot;{search}&quot;
          </span>
        )}
      </motion.h1>

      <motion.div className="max-w-xl mb-8" variants={itemVariants}>
        <Form method="get" className="relative">
          <Input
            type="search"
            name="search"
            placeholder="Search characters..."
            value={inputValue}
            onChange={onSearchChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:border-transparent"
          />
        </Form>
      </motion.div>

      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center text-gray-500 py-8"
          >
            Loading...
          </motion.div>
        ) : error ? (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center text-red-500 py-8"
          >
            {error}
          </motion.div>
        ) : !characters?.results?.length ? (
          <motion.div
            key="no-results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center text-gray-500 py-8"
          >
            No characters found {search && `matching "${search}"`}
          </motion.div>
        ) : (
          <motion.div
            key="results"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={containerVariants}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {characters.results.map((character, index) => (
                <motion.div
                  key={character.id}
                  variants={cardVariants}
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <CharacterCard character={character} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default RickAndMortyPage;

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2 },
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
      damping: 12,
    },
  },
};

const cardVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: (i: number) => ({
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 80,
      delay: i * 0.05,
    },
  }),
  exit: { scale: 0.8, opacity: 0, transition: { duration: 0.2 } },
};
