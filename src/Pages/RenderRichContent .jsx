import React from 'react';

const RenderRichContent = ({ html }) => {
  const parseHtmlWithEmbeds = (htmlContent) => {
    const urlRegex = /(https?:\/\/[^\s"<]+[^.,:;"'\])\s<>])/gi;

    return htmlContent.replace(urlRegex, (url) => {
      // Embed YouTube
      if (url.includes('youtube.com/watch?v=') || url.includes('youtu.be/')) {
        const videoId = url.includes('youtu.be/')
          ? url.split('youtu.be/')[1].split('?')[0]
          : new URL(url).searchParams.get('v');
        if (videoId) {
          return `<div class="my-4"><iframe width="100%" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe></div>`;
        }
      }

      // Embed image
      if (/\.(jpeg|jpg|gif|png|webp|svg)$/i.test(url)) {
        return `<img src="${url}" alt="Image" class="my-4 rounded max-w-full h-auto" />`;
      }

      // Embed video (e.g., mp4)
      if (/\.(mp4|webm|ogg)$/i.test(url)) {
        return `<video controls class="my-4 max-w-full h-auto"><source src="${url}" type="video/mp4">Your browser does not support the video tag.</video>`;
      }

      // Otherwise return as a normal link
      return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-blue-600 underline">${url}</a>`;
    });
  };

  return (
    <div
      dangerouslySetInnerHTML={{ __html: parseHtmlWithEmbeds(html) }}
    />
  );
};

export default RenderRichContent;
