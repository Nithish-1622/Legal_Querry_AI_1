import React, { useState } from "react";
import lawyersData from "../data/lawyer.json";
import law1 from "../assets/law1.jpeg";
import law2 from "../assets/law2.jpeg";
import law3 from "../assets/law3.jpeg";
import law4 from "../assets/law4.jpeg";
import law5 from "../assets/law5.jpeg";
import law6 from "../assets/law6.jpeg";
import law7 from "../assets/law7.jpeg";
import law8 from "../assets/law8.jpeg";
import law9 from "../assets/law9.jpeg";
import law10 from "../assets/law10.jpeg";
import law11 from "../assets/law11.jpeg";
import law12 from "../assets/law12.jpeg";
import law13 from "../assets/law13.jpeg";
import law14 from "../assets/law14.jpeg";
import law15 from "../assets/law15.jpeg";
import law16 from "../assets/law16.jpeg";
import law17 from "../assets/law17.jpeg";
import law18 from "../assets/law18.jpeg";
import law19 from "../assets/law19.jpeg";
import law20 from "../assets/law20.jpeg";
import law21 from "../assets/law21.jpeg";
import law22 from "../assets/law22.jpeg";
import law23 from "../assets/law23.jpeg";
import law24 from "../assets/law24.jpeg";


export default function Lawyer() {
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");
  const [experienceFilter, setExperienceFilter] = useState("");

  const lawyerImages = [law1, law2, law3, law4, law5, law6,law7, law8, law9, law10, 
    law11, law12, law13, law14, law15, law16, law17, law18, law19, law20, law21, law22,
    law23, law24];
  const getRandomImage = () =>
    lawyerImages[Math.floor(Math.random() * lawyerImages.length)];

const filteredLawyers = lawyersData.filter((lawyer) => {
  const matchesSearch =
    lawyer.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lawyer.zone.toLowerCase().includes(searchTerm.toLowerCase());

  const matchesRating =
    ratingFilter === "" || lawyer.rating >= parseFloat(ratingFilter);

  // Clean & convert experience to number
  const exp = parseInt(lawyer.experience.toString().replace(/[^0-9]/g, ""), 10);

  const matchesExperience =
    experienceFilter === "" ||
    (experienceFilter === "0-5" && exp >= 0 && exp <= 5) ||
    (experienceFilter === "5-10" && exp > 5 && exp <= 10) ||
    (experienceFilter === "10+" && exp > 10);

  return matchesSearch && matchesRating && matchesExperience;
});


  return (
    <div
      className="min-h-screen p-6"
      style={{
        background: "linear-gradient(135deg, #f0fff4, #d1fae5, #a7f3d0)",
      }}
    >
      {/* Heading */}
      <h1 className="text-4xl font-extrabold text-green-800 text-center mb-8 tracking-wide drop-shadow-lg">
        Lawyers
      </h1>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-8 justify-center">
        <input
          type="text"
          placeholder="Search by category or zone..."
          className="border border-green-500 rounded-lg px-4 py-2 w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-green-600 shadow-sm bg-white"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          className="border border-green-500 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-600 shadow-sm bg-white"
          value={ratingFilter}
          onChange={(e) => setRatingFilter(e.target.value)}
        >
          <option value="">Filter by rating</option>
          <option value="4.5">4.5★ & above</option>
          <option value="4">4★ & above</option>
          <option value="3">3★ & above</option>
        </select>

        <select
          className="border border-green-500 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-600 shadow-sm bg-white"
          value={experienceFilter}
          onChange={(e) => setExperienceFilter(e.target.value)}
        >
          <option value="">Filter by experience</option>
          <option value="0-5">0–5 years</option>
          <option value="5-10">5–10 years</option>
          <option value="10+">10+ years</option>
        </select>
      </div>

      {/* Lawyer Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredLawyers.map((lawyer, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-green-100"
          >
            {/* Image */}
            <img
              src={getRandomImage()}
              alt={lawyer.name}
              className="w-full h-56 object-cover rounded-t-xl"
            />

            {/* Details */}
            <div className="p-4">
              <h2 className="text-xl font-bold text-green-700 mb-2">
                {lawyer.name}
              </h2>
              <p className="text-gray-700">
                <strong>Zone:</strong> {lawyer.zone}
              </p>
              <p className="text-gray-700">
                <strong>Category:</strong> {lawyer.category}
              </p>
              <p className="text-gray-700">
                <strong>Experience:</strong> {lawyer.experience} years
              </p>
              <p className="text-gray-700">
                <strong>Rating:</strong> ⭐ {lawyer.rating}
              </p>
              <p className="text-gray-700">
                <strong>Email:</strong> {lawyer.email}
              </p>
              <p className="text-gray-700">
                <strong>Phone:</strong> {lawyer.phone}
              </p>
              <p className="text-gray-700">
                <strong>Address:</strong> {lawyer.address}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredLawyers.length === 0 && (
        <p className="text-center text-gray-500 mt-6">
          No lawyers match your search or filter.
        </p>
      )}
    </div>
  );
}