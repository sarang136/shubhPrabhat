import React from "react";

const NewsDetails = ({ news }) => {
  if (!news) return <p>Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow mt-10">
      <div
        className="text-3xl font-bold mb-2"
        dangerouslySetInnerHTML={{ __html: news.MainHeadline }}
      />

      <div
        className="text-xl text-gray-700 font-medium mb-4"
        dangerouslySetInnerHTML={{ __html: news.Subheadline }}
      />

      {news.image && (
        <img
          src={news.image}
          alt="news"
          className="w-full h-auto max-h-[500px] object-cover rounded mb-6"
        />
      )}

      <div
        className="prose max-w-none text-gray-800"
        dangerouslySetInnerHTML={{ __html: news.Description }}
      />
    </div>
  );
};

export default NewsDetails;
