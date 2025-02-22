import React, { useRef, useState, useEffect } from "react";
import { Copy, Check, Menu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Documentation = () => {
  const [showCopied, setShowCopied] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('introduction');
  const [scrollProgress, setScrollProgress] = useState(0);

  const textRef = useRef(null);
  const introRef = useRef(null);
  const basicRef = useRef(null);
  const advancedRef = useRef(null);
  const examplesRef = useRef(null);
  const troubleshootRef = useRef(null);

  const sections = [
    { id: 'introduction', title: 'Introduction', ref: introRef },
    { id: 'basics', title: 'Basic Concepts', ref: basicRef },
    { id: 'advanced', title: 'Advanced Topics', ref: advancedRef },
    { id: 'examples', title: 'Code Examples', ref: examplesRef },
    { id: 'troubleshoot', title: 'Troubleshooting', ref: troubleshootRef }
  ];

  const codeSnippet = `const greet = (name) => {
  return \`Hello, \${name}!\`;
};

console.log(greet("Eventverse"));`;

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      const scrolled = window.scrollY;
      const progress = (scrolled / documentHeight) * 100;
      setScrollProgress(progress);

      // Update active section based on scroll position
      sections.forEach(({ id, ref }) => {
        if (ref.current) {
          const rect = ref.current.getBoundingClientRect();
          if (rect.top <= windowHeight / 3 && rect.bottom >= windowHeight / 3) {
            setActiveSection(id);
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCopy = () => {
    if (textRef.current) {
      const range = document.createRange();
      range.selectNodeContents(textRef.current);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      document.execCommand("copy");
      selection.removeAllRanges();

      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    }
  };

  const scrollToSection = (ref, id) => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveSection(id);
    setIsSidebarOpen(false);
  };

  const sidebarVariants = {
    open: {
      x: 0,
      transition: { type: "spring", stiffness: 300, damping: 30 }
    },
    closed: {
      x: "-100%",
      transition: { type: "spring", stiffness: 300, damping: 30 }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex max-w-6xl mx-auto mt-10"
    >
      {/* Sidebar */}
      <AnimatePresence>
        <motion.div
          initial="closed"
          animate={isSidebarOpen ? "open" : "closed"}
          variants={sidebarVariants}
          className="fixed lg:relative z-10 lg:w-1/4 h-full lg:h-auto lg:translate-x-0 bg-gray-900 lg:bg-gray-100 lg:shadow-lg lg:rounded-lg p-6 text-white lg:text-black lg:sticky top-20"
        >
          {/* Progress Bar */}
          <motion.div 
            className="absolute left-0 w-1 h-full bg-gray-300"
          >
            <motion.div 
              className="w-full bg-purple-500"
              style={{ 
                height: `${scrollProgress}%`,
                transition: "height 0.2s ease"
              }}
            />
          </motion.div>

          {/* Sidebar Header */}
          <motion.div className="flex items-center justify-between lg:hidden">
            <h2 className="text-xl font-semibold">Documentation</h2>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsSidebarOpen(false)}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </motion.button>
          </motion.div>

          {/* Sidebar Links */}
          <motion.ul className="mt-4 space-y-2 relative">
            {sections.map(({ id, title, ref }) => (
              <motion.li
                key={id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => scrollToSection(ref, id)}
                  className={`block w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition
                    ${activeSection === id 
                      ? 'bg-purple-500 text-white' 
                      : 'bg-gray-800 lg:bg-gray-200 hover:bg-gray-700 lg:hover:bg-gray-300'
                    }`}
                >
                  {title}
                </motion.button>
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>
      </AnimatePresence>

      {/* Main Content */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex-1 p-8 bg-gray-200 shadow-xl rounded-lg"
      >
        <section ref={introRef} className="mb-16">
          <motion.h1 className="text-3xl font-bold mb-4 text-gray-900">
            Introduction
          </motion.h1>
          <p className="text-gray-700 leading-relaxed">
            Welcome to our comprehensive documentation. This guide will help you understand
            the core concepts and advanced features of our platform.
          </p>
        </section>

        <section ref={basicRef} className="mb-16">
          <motion.h2 className="text-2xl font-bold mb-4 text-gray-900">
            Basic Concepts
          </motion.h2>
          <p className="text-gray-700 leading-relaxed">
            Learn about the fundamental concepts and building blocks that form the
            foundation of our platform's architecture.
          </p>
        </section>

        <section ref={advancedRef} className="mb-16">
          <motion.h2 className="text-2xl font-bold mb-4 text-gray-900">
            Advanced Topics
          </motion.h2>
          <p className="text-gray-700 leading-relaxed">
            Dive deep into advanced features and sophisticated implementation
            patterns for complex use cases.
          </p>
        </section>

        <section ref={examplesRef} className="mb-16">
          <motion.h2 className="text-2xl font-bold mb-4 text-gray-900">
            Code Examples
          </motion.h2>
          <motion.div 
            whileHover={{ scale: 1.01 }}
            className="bg-gray-900 text-white p-6 rounded-lg font-mono relative"
          >
            <div className="absolute top-3 left-3 flex space-x-2">
              <motion.span whileHover={{ scale: 1.2 }} className="w-3 h-3 bg-red-500 rounded-full" />
              <motion.span whileHover={{ scale: 1.2 }} className="w-3 h-3 bg-yellow-500 rounded-full" />
              <motion.span whileHover={{ scale: 1.2 }} className="w-3 h-3 bg-green-500 rounded-full" />
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleCopy}
              className="absolute top-3 right-3 p-2 text-gray-400 hover:text-white transition-colors duration-200 rounded-md hover:bg-gray-800"
            >
              {showCopied ? (
                <Check className="w-5 h-5 text-green-500" />
              ) : (
                <Copy className="w-5 h-5" />
              )}
            </motion.button>

            <pre ref={textRef} className="overflow-x-auto mt-6">
              <code className="text-sm">{codeSnippet}</code>
            </pre>
          </motion.div>
        </section>

        <section ref={troubleshootRef} className="mb-16">
          <motion.h2 className="text-2xl font-bold mb-4 text-gray-900">
            Troubleshooting
          </motion.h2>
          <p className="text-gray-700 leading-relaxed">
            Find solutions to common issues and learn how to debug problems
            effectively in your implementation.
          </p>
        </section>

        {/* Toast Notification */}
        <AnimatePresence>
          {showCopied && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="fixed bottom-4 right-4"
            >
              <div className="bg-gray-900 text-white px-4 py-2 rounded-md text-sm shadow-lg">
                Copied to clipboard!
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Mobile Sidebar Toggle */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsSidebarOpen(true)}
        className="fixed top-4 left-4 lg:hidden bg-gray-900 text-white p-2 rounded-md shadow-lg"
      >
        <Menu className="w-5 h-5" />
      </motion.button>
    </motion.div>
  );
};

export default Documentation;