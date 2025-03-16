import { Outlet, useLocation } from "@remix-run/react";
import { AnimatePresence } from "framer-motion";

/**
 * Layout component for Rick and Morty section that handles page transitions
 * between routes using Framer Motion's AnimatePresence
 */
const RickAndMortyLayout = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Outlet key={location.pathname} />
    </AnimatePresence>
  );
}

export default RickAndMortyLayout;
