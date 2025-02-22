import React from "react";
import Card from "../components/Card";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center text-gray-100 mb-8">
          Image Gallery App
        </h1>
        <Card />
      </div>
    </div>
  );
}

export default App;