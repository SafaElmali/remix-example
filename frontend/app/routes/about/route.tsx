import { json } from "@remix-run/node";
import { useLoaderData, Link, MetaFunction } from "@remix-run/react";
import { motion } from "framer-motion";
import axios from "axios";

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
      content:
        "Information about this application, its features and technologies",
    },
    { name: "robots", content: "index,follow" },
    { name: "viewport", content: "width=device-width,initial-scale=1" },
  ];
};

// Loader function to fetch the about page data from the API
export const loader = async () => {
  try {
    const response = await axios.get("http://localhost:3001/api/v1/about");
    return json({ about: response.data, error: null });
  } catch (error) {
    console.error("Error fetching about data:", error);
    return json({
      about: null,
      error: "Failed to load about page data",
    });
  }
};

const About = () => {
  const { about, error } = useLoaderData<typeof loader>();

  return (
    <motion.div
      className="p-6 max-w-4xl mx-auto"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <motion.h1 className="text-3xl font-bold" variants={itemVariants}>
          {about?.title || "About This Application"}
        </motion.h1>

        <Link
          to="/about/edit"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Edit Page
        </Link>
      </div>

      <motion.section className="mb-8" variants={itemVariants}>
        <motion.h2
          className="text-2xl font-semibold mb-4"
          variants={itemVariants}
        >
          Overview
        </motion.h2>
        <motion.div
          className="text-gray-700 mb-4 prose max-w-none"
          variants={itemVariants}
          dangerouslySetInnerHTML={{
            __html:
              about?.content ||
              `
            <p>This is a Remix-based web application that demonstrates modern web development 
            practices. It features a responsive design, client-side navigation, and integration 
            with external APIs.</p>
            <p>The application showcases characters from the Rick and Morty series using the 
            public Rick and Morty API, with features like search and detailed character views.</p>
          `,
          }}
        />
      </motion.section>

      <motion.section className="mb-8" variants={itemVariants}>
        <motion.h2
          className="text-2xl font-semibold mb-4"
          variants={itemVariants}
        >
          {about?.description || "Technologies Used"}
        </motion.h2>
        <motion.ul className="list-disc pl-6 space-y-2 text-gray-700">
          {[
            {
              tech: "Remix",
              desc: "A full stack web framework that lets you focus on the user interface",
            },
            {
              tech: "React",
              desc: "A JavaScript library for building user interfaces",
            },
            { tech: "TypeScript", desc: "Typed JavaScript at scale" },
            { tech: "Tailwind CSS", desc: "A utility-first CSS framework" },
            {
              tech: "Framer Motion",
              desc: "A production-ready motion library for React",
            },
            { tech: "Rails API", desc: "Backend API built with Ruby on Rails" },
            { tech: "TipTap", desc: "Headless rich text editor for React" },
          ].map((item, index) => (
            <motion.li key={index} variants={listItemVariants} custom={index}>
              <span className="font-medium">{item.tech}</span> - {item.desc}
            </motion.li>
          ))}
        </motion.ul>
      </motion.section>

      <motion.section className="mb-8" variants={itemVariants}>
        <motion.h2
          className="text-2xl font-semibold mb-4"
          variants={itemVariants}
        >
          Features
        </motion.h2>
        <motion.ul className="list-disc pl-6 space-y-2 text-gray-700">
          {[
            "Responsive design that works on desktop and mobile",
            "Fast page navigation with Remix",
            "Character search with debounced input",
            "Detailed character information",
            "Clean and modern UI with Tailwind CSS",
            "Smooth animations with Framer Motion",
            "Content management with TipTap editor",
          ].map((feature, index) => (
            <motion.li key={index} variants={listItemVariants} custom={index}>
              {feature}
            </motion.li>
          ))}
        </motion.ul>
      </motion.section>
    </motion.div>
  );
};

export default About;

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
