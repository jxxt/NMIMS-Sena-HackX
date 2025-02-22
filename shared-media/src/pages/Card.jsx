import React, { useEffect, useState } from "react";
import { Loader2, X, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ImageGallery = () => {
  const [imageUrls, setImageUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enlargedImageIndex, setEnlargedImageIndex] = useState(null);
  const [imageLoading, setImageLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/get-all-images/");
        const result = await response.json();

        if (response.ok) {
          setImageUrls(result.image_urls || []);
        } else {
          console.error("Failed to fetch images:", result.detail);
        }
      } catch (error) {
        console.error("Error fetching images:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleCloseModal = (e) => {
    e.stopPropagation();
    setEnlargedImageIndex(null);
  };

  const handleModalClick = (e) => {
    if (e.target === e.currentTarget) {
      setEnlargedImageIndex(null);
    }
  };

  const handleNextImage = () => {
    setImageLoading(true);
    setEnlargedImageIndex((prevIndex) => (prevIndex + 1) % imageUrls.length);
  };

  const handlePrevImage = () => {
    setImageLoading(true);
    setEnlargedImageIndex((prevIndex) =>
      prevIndex === 0 ? imageUrls.length - 1 : prevIndex - 1
    );
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (enlargedImageIndex !== null) {
        if (event.key === "ArrowRight") handleNextImage();
        if (event.key === "ArrowLeft") handlePrevImage();
        if (event.key === "Escape") setEnlargedImageIndex(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enlargedImageIndex]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-10 p-8 max-w-6xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-300"
    >
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold text-purple-700 text-center mb-8"
      >
        Image Gallery
      </motion.h2>

      {loading ? (
        <div className="flex justify-center items-center h-60">
          <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
        </div>
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          {imageUrls.length > 0 ? (
            imageUrls.map((url, index) => (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, scale: 0.8 },
                  visible: { opacity: 1, scale: 1 }
                }}
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-br from-purple-200 to-purple-100 rounded-lg shadow-md overflow-hidden"
              >
                <div className="h-48 flex items-center justify-center p-4">
                  <motion.img
                    src={url}
                    alt={`Gallery item ${index + 1}`}
                    className="max-w-full max-h-full object-contain cursor-pointer"
                    whileHover={{ scale: 1.1 }}
                    onClick={() => {
                      setEnlargedImageIndex(index);
                      setImageLoading(true);
                    }}
                  />
                </div>
                <div className="p-4 bg-purple-100 text-center">
                  <p className="text-purple-700 font-medium">
                    Image {index + 1}
                  </p>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full text-center py-12"
            >
              <p className="text-purple-600 text-lg">No images available</p>
            </motion.div>
          )}
        </motion.div>
      )}

      <AnimatePresence>
        {enlargedImageIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-purple-900 bg-opacity-75 flex items-center justify-center z-50"
            onClick={handleModalClick}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="relative max-w-[90vw] max-h-[90vh] bg-white p-8 rounded-lg shadow-lg border border-purple-300 flex items-center"
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute left-4 p-2 bg-purple-200 hover:bg-purple-300 rounded-full transition duration-200 flex items-center justify-center"
                onClick={handlePrevImage}
              >
                <ChevronLeft className="w-6 h-6 text-purple-700 hover:text-purple-900" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute top-2 right-2 p-2 bg-purple-200 hover:bg-purple-300 rounded-full transition duration-200"
                onClick={handleCloseModal}
              >
                <X className="w-6 h-6 text-purple-700 hover:text-purple-900" />
              </motion.button>

              {imageLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
                </div>
              )}

              <motion.img
                key={enlargedImageIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                src={imageUrls[enlargedImageIndex]}
                alt="Enlarged view"
                className={`max-w-full max-h-[80vh] object-contain rounded-lg shadow-xl ${
                  imageLoading ? "opacity-0" : "opacity-100"
                }`}
                onLoad={handleImageLoad}
              />

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute right-4 p-2 bg-purple-200 hover:bg-purple-300 rounded-full transition duration-200 flex items-center justify-center"
                onClick={handleNextImage}
              >
                <ChevronRight className="w-6 h-6 text-purple-700 hover:text-purple-900" />
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ImageGallery;