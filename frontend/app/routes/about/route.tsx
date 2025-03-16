import { MetaFunction } from "@remix-run/react";
import { motion } from "framer-motion";

export const meta: MetaFunction = () => {
  return [
    { title: "About | My App" },
    {
      name: "description",
      content: "Learn more about this application and its features",
    },
    { property: "og:title", content: "About My App" },
    {
      property: "og:description",
      content: "Information about this application, its features and technologies",
    },
    { name: "robots", content: "index,follow" },
    { name: "viewport", content: "width=device-width,initial-scale=1" },
  ];
};

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
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
      damping: 12,
    },
  },
};

const listItemVariants = {
  hidden: { x: -10, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
    },
  },
};

const About = () => {
  return (
    <motion.div 
      className="p-6 max-w-4xl mx-auto"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.h1 
        className="text-3xl font-bold mb-6"
        variants={itemVariants}
      >
        About This Application
      </motion.h1>
      
      <motion.section className="mb-8" variants={itemVariants}>
        <motion.h2 className="text-2xl font-semibold mb-4" variants={itemVariants}>
          Overview
        </motion.h2>
        <motion.p className="text-gray-700 mb-4" variants={itemVariants}>
          This is a Remix-based web application that demonstrates modern web development 
          practices. It features a responsive design, client-side navigation, and integration 
          with external APIs.
        </motion.p>
        <motion.p className="text-gray-700" variants={itemVariants}>
          The application showcases characters from the Rick and Morty series using the 
          public Rick and Morty API, with features like search and detailed character views.
        </motion.p>
      </motion.section>
      
      <motion.section className="mb-8" variants={itemVariants}>
        <motion.h2 className="text-2xl font-semibold mb-4" variants={itemVariants}>
          Technologies Used
        </motion.h2>
        <motion.ul className="list-disc pl-6 space-y-2 text-gray-700">
          {[
            { tech: "Remix", desc: "A full stack web framework that lets you focus on the user interface" },
            { tech: "React", desc: "A JavaScript library for building user interfaces" },
            { tech: "TypeScript", desc: "Typed JavaScript at scale" },
            { tech: "Tailwind CSS", desc: "A utility-first CSS framework" },
            { tech: "Framer Motion", desc: "A production-ready motion library for React" },
            { tech: "Rick and Morty API", desc: "External API for Rick and Morty data" }
          ].map((item, index) => (
            <motion.li 
              key={index}
              variants={listItemVariants}
              custom={index}
            >
              <span className="font-medium">{item.tech}</span> - {item.desc}
            </motion.li>
          ))}
        </motion.ul>
      </motion.section>
      
      <motion.section className="mb-8" variants={itemVariants}>
        <motion.h2 className="text-2xl font-semibold mb-4" variants={itemVariants}>
          Features
        </motion.h2>
        <motion.ul className="list-disc pl-6 space-y-2 text-gray-700">
          {[
            "Responsive design that works on desktop and mobile",
            "Fast page navigation with Remix",
            "Character search with debounced input",
            "Detailed character information",
            "Clean and modern UI with Tailwind CSS",
            "Smooth animations with Framer Motion"
          ].map((feature, index) => (
            <motion.li 
              key={index}
              variants={listItemVariants}
              custom={index}
            >
              {feature}
            </motion.li>
          ))}
        </motion.ul>
      </motion.section>
    </motion.div>
  );
};

export default About;
