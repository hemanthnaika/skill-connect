import { testimonials } from "@/constants";
import Image from "next/image";
import React from "react";

const Testimonial = () => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6 pt-14">
      {testimonials.slice(0, 3).map((testimonial, i) => (
        <div
          className="text-sm w-80 border border-gray-200 pb-6 rounded-lg bg-white shadow-[0px_4px_15px_0px] shadow-black/5"
          key={i}
        >
          <div className="flex flex-col items-center px-5 py-4 relative">
            <Image
              height={500}
              width={500}
              className="h-24 w-24 absolute -top-14 rounded-full"
              src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200"
              alt="userImage1"
            />
            <div className="pt-8 text-center">
              <h1 className="text-lg font-medium text-gray-800">
                {testimonial.name}
              </h1>
              <p className="text-gray-800/80">{testimonial.role}</p>
            </div>
          </div>
          <p className="text-gray-500 px-6 text-center">{testimonial.quote}</p>
          <div className="flex justify-center pt-4">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg
                  key={i}
                  width="18"
                  height="18"
                  viewBox="0 0 22 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10.525.464a.5.5 0 0 1 .95 0l2.107 6.482a.5.5 0 0 0 .475.346h6.817a.5.5 0 0 1 .294.904l-5.515 4.007a.5.5 0 0 0-.181.559l2.106 6.483a.5.5 0 0 1-.77.559l-5.514-4.007a.5.5 0 0 0-.588 0l-5.514 4.007a.5.5 0 0 1-.77-.56l2.106-6.482a.5.5 0 0 0-.181-.56L.832 8.197a.5.5 0 0 1 .294-.904h6.817a.5.5 0 0 0 .475-.346z"
                    fill="#FF532E"
                  />
                </svg>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Testimonial;
