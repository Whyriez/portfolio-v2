import NextImage from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

function PortfolioCard({ category, title, description, tags, link, images }) {
 const safeGradients = [
  { from: 'from-yellow-400', to: 'to-lime-500' },
  { from: 'from-green-400', to: 'to-emerald-500' },
  { from: 'from-teal-400', to: 'to-cyan-500' },
  { from: 'from-sky-400', to: 'to-blue-500' },
  { from: 'from-indigo-400', to: 'to-violet-500' },
  { from: 'from-purple-400', to: 'to-fuchsia-500' },
  { from: 'from-pink-400', to: 'to-rose-500' },
  { from: 'from-amber-400', to: 'to-orange-500' },
  { from: 'from-lime-400', to: 'to-green-500' },
  { from: 'from-emerald-400', to: 'to-teal-500' },
  { from: 'from-cyan-400', to: 'to-sky-500' },
  { from: 'from-blue-400', to: 'to-indigo-500' },
  { from: 'from-violet-400', to: 'to-purple-500' },
  { from: 'from-fuchsia-400', to: 'to-pink-500' },
  { from: 'from-rose-400', to: 'to-red-500' },
  { from: 'from-orange-400', to: 'to-amber-500' }
];


  const randomGradient = useMemo(() => {
    return safeGradients[Math.floor(Math.random() * safeGradients.length)];
  }, []);


  return (
    <div
      className="glassmorphism project-card rounded-xl overflow-hidden portfolio-item"
      data-category={category}
    >
      <div className="relative">
        <div className={`h-48 bg-gradient-to-r ${randomGradient.from} ${randomGradient.to} relative`}>
          <NextImage
            className="w-48 h-48 object-contain absolute bottom-0 left-1/2 -translate-x-1/2"
            src={images}
            width={192} // 12rem = 192px
            height={192}
            alt="project images"
          />
        </div>

        <div className="absolute inset-0 bg-black/0 hover:bg-black/50 flex items-center justify-center transition-all opacity-0 hover:opacity-100">
          <Link href={link} target="__BLANK" className="px-4 py-2 bg-white dark:bg-gray-800 rounded-full text-gray-800 font-medium transform -translate-y-4 hover:translate-y-0 transition-all">
            View Project
          </Link>
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-4">{description}</p>
        <div className="flex space-x-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className={`px-2 py-1 rounded-md text-xs ${getTagStyle(tag)}`}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function getTagStyle(tag) {
  const tagColors = {
    React: "bg-blue-100 text-blue-600",
    "Node.js": "bg-green-100 text-green-600",
    "React Native": "bg-blue-100 text-blue-600",
    Firebase: "bg-yellow-100 text-yellow-600",
    "C#": "bg-purple-100 text-purple-600",
    "Kotlin Xml": "bg-pink-100 text-pink-600",
    "Kotlin Compose": "bg-purple-100 text-purple-600",
    JavaScript: "bg-yellow-100 text-yellow-600",
    Flutter: "bg-sky-100 text-sky-600",
    "Next Js": "bg-gray-100 text-gray-600",
    "HTML/CSS": "bg-orange-100 text-orange-600",
    "PHP Native": "bg-indigo-100 text-indigo-600",
    Laravel: "bg-red-100 text-red-600",
  };

  return tagColors[tag] || "bg-gray-200 text-gray-700";
}

export default PortfolioCard;
