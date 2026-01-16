'use client';
import PortfolioCard from "@/components/features/portfolio/PortfolioCard";
import { useEffect, useState } from "react";

function PortfolioPage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("all");
  const [projectData, setProjectData] = useState([]);

  const filteredProjects =
    activeFilter === "all"
      ? projectData
      : projectData.filter((project) => project.category === activeFilter);

  // const fetchData = async () => {
  //   try {
  //     const snapshot = await getDocs(collection(db, "projects"));
  //     const newUserData = [];

  //     snapshot.forEach((doc) => {
  //       newUserData.push({
  //         id: doc.id,
  //         ...doc.data(),
  //       });
  //     });

  //     setProjectData(newUserData);
  //     const uniqueCategories = [
  //       ...new Set(newUserData.map((item) => item.category)),
  //     ];
  //     setCategories(uniqueCategories);
  //   } catch (error) {
  //     console.error("Error fetching user data:", error);
  //   }
  // };


  // useEffect(() => {
  //   fetchData();
  // }, []);

  return (
    <section id="portfolioPage" className="page-section active">
      <h2 className="text-4xl font-bold text-gray-800 mb-8">My Portfolio</h2>

      {/* Filter Buttons */}
      <div className="flex flex-wrap justify-center mb-8">
        {["all", ...categories].map((filter) => (
          <button
            key={filter}
            className={`portfolio-filter px-4 py-2 m-1 rounded-full font-medium ${
              activeFilter === filter
                ? "bg-white dark:bg-gray-800 bg-opacity-30 text-gray-800"
                : "text-gray-600"
            }`}
            onClick={() => setActiveFilter(filter)}
          >
            {filter === "all" ? "All" : filter}
          </button>
        ))}
      </div>

      {/* Filtered Projects */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project, index) => (
          <PortfolioCard key={index} {...project} />
        ))}
      </div>
    </section>
  );
}

export default PortfolioPage;
