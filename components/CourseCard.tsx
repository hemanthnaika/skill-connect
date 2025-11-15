import { EarIcon, Earth, Star, Users } from "lucide-react";
import Image from "next/image";
import React from "react";
import { Button } from "./ui/button";

const CourseCard = () => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-8">
      <div className="max-w-72 w-full hover:-translate-y-0.5 transition duration-300">
        <Image
          width={500}
          height={500}
          className="rounded-xl"
          src="https://images.unsplash.com/photo-1512428559087-560fa5ceab42?w=1200&h=800&auto=format&fit=crop&q=60"
          alt="Skill Workshop"
        />
        <div className="flex items-center mt-2 justify-between">
          <span className="inline-block text-slate-400">Art & Creativity</span>
          <div className="flex">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star
                key={index}
                className="fill-amber-400 text-yellow-400 w-3 h-3"
              />
            ))}
          </div>
        </div>
        <h3 className="text-base text-slate-900 font-medium mt-1">
          Beginner Drawing Workshop
        </h3>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Earth className="w-5 h-5" /> Online Session
          </span>
          <p className="text-xl text-indigo-600 font-medium mt-1">Free</p>
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="flex items-center gap-2 text-slate-600 text-sm">
            <Users className="w-4 h-4" /> 120 Students
          </span>

          {/* Register Button */}
          <Button
            type="button"
            className="px-4 py-1.5 rounded-md bg-primary text-white text-sm hover:bg-primary/80 active:scale-95 transition-all"
          >
            Know More
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
