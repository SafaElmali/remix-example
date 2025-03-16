import { Outlet } from "@remix-run/react";
import { motion } from "framer-motion";

export default function AboutLayout() {
  return (
    <motion.div
      className="about-layout container mx-auto py-8 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="about-content">
        <Outlet />
      </div>
    </motion.div>
  );
}
