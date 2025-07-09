import React from "react";
import DOMPurify from "dompurify";
import parse from "html-react-parser";

const ReadNewsModal = ({ news, onClose }) => {
  if (!news) return null;

  const { product } = news;

  const sanitizedDescription = DOMPurify.sanitize(product?.Description || "");

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center px-4">
      <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 w-full max-w-3xl relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-600 hover:text-black text-2xl font-bold"
        >
          &times;
        </button>

        {/* Image/Video */}
        

        {/* Headline */}
        <h2 className="text-2xl font-semibold text-[#0f1e36] mb-2">{product.MainHeadline}</h2>

        {/* Subheadline */}
        <h3 className="text-lg text-[#444] font-medium mb-4">{product.Subheadline}</h3>

        <div className="w-full h-[60vh] overflow-hidden rounded mb-4 bg-gray-200">
          {product.image?.match(/\.(mp4|webm|ogg)$/i) ? (
            <video src={product.image} controls className="w-full h-full object-cover" />
          ) : (
            <img src={product.image || "/default-news.png"} alt="News" className="w-full h-full object-cover" />
          )}
        </div>

        {/* Description (sanitized HTML rendered safely) */}
        <div className="text-gray-700 prose max-w-full">
          {parse(sanitizedDescription)}
        </div>
      </div>
    </div>
  );
};

export default ReadNewsModal;
