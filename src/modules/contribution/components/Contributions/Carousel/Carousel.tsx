"use client"

import { useState } from "react";
import { UserCardProps } from "../../../types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import UserCard from "@/modules/contribution/components/Contributions/cards/userCard";


const ContributionCarousel: React.FC<{ contributions: UserCardProps[] }> = ({ contributions }) => {
  
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % contributions.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + contributions.length) % contributions.length);
    };

    if (contributions.length === 0) {
        return (
            <div className="text-center py-20">
                <p className="text-slate-400 text-lg">No contributions yet. Be the first!</p>
            </div>
        );
    }

    return (
        <div className="relative w-full max-w-6xl mx-auto px-4">
            {/* Carousel Container */}
            <div className="relative flex items-center justify-center py-12">
                {/* Previous Button */}
                <button
                    onClick={prevSlide}
                    className="absolute left-0 z-30 p-4 rounded-full bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 hover:bg-slate-700/80 transition-all shadow-xl hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={contributions.length <= 1}
                    aria-label="Previous contribution"
                >
                    <ChevronLeft className="text-slate-300" size={24} />
                </button>

                {/* Card Display */}
                <div className="overflow-hidden w-full flex justify-center">
                    <div
                        className="flex transition-transform duration-700 ease-in-out"
                        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                    >
                        {contributions.map((contribution, idx) => (
                            <div key={idx} className="flex-shrink-0 w-full flex justify-center px-4">
                                <UserCard {...contribution} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Next Button */}
                <button
                    onClick={nextSlide}
                    className="absolute right-0 z-30 p-4 rounded-full bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 hover:bg-slate-700/80 transition-all shadow-xl hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={contributions.length <= 1}
                    aria-label="Next contribution"
                >
                    <ChevronRight className="text-slate-300" size={24} />
                </button>
            </div>

            {/* Dots Indicator */}
            <div className="flex justify-center gap-2 mt-6">
                {contributions.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`h-2 rounded-full transition-all ${
                            idx === currentIndex
                                ? "w-8 bg-indigo-500"
                                : "w-2 bg-slate-700 hover:bg-slate-600"
                        }`}
                        aria-label={`Go to contribution ${idx + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default ContributionCarousel