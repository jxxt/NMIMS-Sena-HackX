import React, { useRef, useState } from "react";
import { Copy, Check, Menu } from "lucide-react";

const Documentation = () => {
  const [showCopied, setShowCopied] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const textRef = useRef(null);
  const docRef = useRef(null);
  const introRef = useRef(null);

  const codeSnippet = `const greet = (name) => {
  return \`Hello, \${name}!\`;
};

console.log(greet("Eventverse"));`;

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

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    setIsSidebarOpen(false); // Close sidebar on mobile after clicking a link
  };

  return (
    <div className="flex max-w-6xl mx-auto mt-10">
      {/* Sidebar */}
      <div
        className={`fixed lg:relative z-10 lg:w-1/4 h-full lg:h-auto transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } bg-gray-900 lg:bg-gray-100 lg:shadow-lg lg:rounded-lg p-6 text-white lg:text-black lg:sticky top-20`}
      >
        {/* Sidebar Header (Mobile Only) */}
        <div className="flex items-center justify-between lg:hidden">
          <h2 className="text-xl font-semibold">Documentation</h2>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Sidebar Links */}
        <ul className="mt-4 space-y-2">
          <li>
            <button
              onClick={() => scrollToSection(introRef)}
              className="block w-full text-left px-4 py-2 rounded-lg text-sm font-medium bg-gray-800 lg:bg-gray-200 hover:bg-gray-700 lg:hover:bg-gray-300 transition"
            >
              Introduction
            </button>
          </li>
          <li>
            <button
              onClick={() => scrollToSection(docRef)}
              className="block w-full text-left px-4 py-2 rounded-lg text-sm font-medium bg-gray-800 lg:bg-gray-200 hover:bg-gray-700 lg:hover:bg-gray-300 transition"
            >
              Code Example
            </button>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 bg-gray-200 shadow-xl rounded-lg">
        <h1 ref={introRef} className="text-3xl font-bold mb-4 text-gray-900">
          Documentation
        </h1>

        <p className="text-gray-700 leading-relaxed">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae
          nisi et eros dapibus fermentum.
        </p>

        {/* Code Block Section */}
        <div ref={docRef} className="relative group mt-8">
          <div className="bg-gray-900 text-white p-6 rounded-lg font-mono relative">
            {/* macOS Style Buttons */}
            <div className="absolute top-3 left-3 flex space-x-2">
              <span className="w-3 h-3 bg-red-500 rounded-full"></span>
              <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
            </div>

            {/* Copy Button Inside Code Block */}
            <button
              onClick={handleCopy}
              className="absolute top-3 right-3 p-2 text-gray-400 hover:text-white transition-colors duration-200 rounded-md hover:bg-gray-800"
              aria-label="Copy code"
            >
              {showCopied ? (
                <Check className="w-5 h-5 text-green-500" />
              ) : (
                <Copy className="w-5 h-5" />
              )}
            </button>

            {/* Code Block */}
            <pre ref={textRef} className="overflow-x-auto mt-6">
              <code className="text-sm">{codeSnippet}</code>
            </pre>
          </div>

          {/* Toast Notification */}
          <div
            className={`absolute bottom-full right-0 mb-2 transition-all duration-200 transform ${
              showCopied
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-2 pointer-events-none"
            }`}
          >
            <div className="bg-gray-900 text-white px-4 py-2 rounded-md text-sm shadow-lg">
              Copied to clipboard!
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Toggle */}
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="fixed top-4 left-4 lg:hidden bg-gray-900 text-white p-2 rounded-md shadow-lg"
      >
        <Menu className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Documentation;
