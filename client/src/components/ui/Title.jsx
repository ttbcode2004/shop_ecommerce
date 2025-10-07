// src/components/ui/Title.jsx
import { motion } from "framer-motion";

export default function Title({ children, NavLinkList, className }) {
  return (
    <div className="w-full flex flex-col my-6">
      {/* Title chính */}
      <motion.h2
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        viewport={{ once: true }}
        className={`text-xl md:text-2xl font-bold text-gray-900  relative inline-block ${className}`}
      >
        <span className="bg-gradient-to-r from-gray-900 via-gray-800  to-gray-800 bg-clip-text text-transparent">
          {children}
        </span>
      </motion.h2>

      {/* {description && (
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-6 max-w-2xl text-sm sm:text-base md:text-lg text-gray-600 "
        >
          {description}
        </motion.p>
      )} */}
    </div>
  );
}
