import React, { useEffect, useState } from "react";
import { Loader2, X } from "lucide-react";

const ImageGallery = () => {
  const [imageUrls, setImageUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enlargedImage, setEnlargedImage] = useState(null);
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
    setEnlargedImage(null);
    setImageLoading(true);
  };

  const handleModalClick = (e) => {
    if (e.target === e.currentTarget) {
      setEnlargedImage(null);
      setImageLoading(true);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto bg-gradient-to-r from-gray-700 to-gray-600 rounded-2xl shadow-xl">
      <h2 className="text-3xl font-bold text-gray-100 text-center mb-8">
        Image Gallery
      </h2>

      {loading ? (
        <div className="flex justify-center items-center h-60">
          <Loader2 className="w-12 h-12 text-blue-300 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {imageUrls.length > 0 ? (
            imageUrls.map((url, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-600 to-gray-500 rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-blue-400/30"
              >
                <div className="h-48 flex items-center justify-center p-4 bg-opacity-50 backdrop-blur-sm">
                  <img
                    src={url}
                    alt={`Gallery item ${index + 1}`}
                    className="max-w-full max-h-full w-auto h-auto object-contain cursor-pointer hover:scale-110 transition-transform duration-300"
                    onClick={() => {
                      setEnlargedImage(url);
                      setImageLoading(true);
                    }}
                  />
                </div>
                <div className="p-4 bg-gray-600/50 backdrop-blur-sm">
                  <p className="text-gray-100 font-medium text-center">
                    Image {index + 1}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-300 text-lg">No images available</p>
            </div>
          )}
        </div>
      )}

      {enlargedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={handleModalClick}
        >
          <div className="relative max-w-[90vw] max-h-[90vh] bg-gray-600/30 p-8 rounded-lg">
            <button
              className="absolute top-2 right-2 p-2 cursor-pointer bg-gray-600 hover:bg-gray-500 rounded-full transition-colors duration-200 z-10 flex items-center justify-center"
              onClick={handleCloseModal}
            >
              <X className="w-6 h-6 text-gray-200 hover:text-white" />
            </button>
            {imageLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-blue-300 animate-spin" />
              </div>
            )}
            <img
              src={enlargedImage}
              alt="Enlarged view"
              className={`max-w-full max-h-[80vh] w-auto h-auto object-contain rounded-lg shadow-xl transition-all duration-300 ${
                imageLoading ? 'opacity-0' : 'opacity-100'
              }`}
              onLoad={handleImageLoad}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;