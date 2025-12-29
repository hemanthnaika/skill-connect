import { logo } from "@/assets/images";
import { Earth, Star, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type CourseCardProps = {
  workshop: Workshop;
};
const CourseCard = ({ workshop }: CourseCardProps) => {
  const title = "Live Guitar Masterclass";

  const instructorRating = 4.8;
  const instructorReviews = 112;

  return (
    <div className="flex flex-wrap items-center justify-center gap-8 bg-white shadow p-5 rounded-md">
      <div className="max-w-72 w-full hover:-translate-y-0.5 transition duration-300 relative">
        {/* Thumbnail */}
        <Image
          width={500}
          height={500}
          className="rounded-xl w-full h-52 object-cover"
          src={workshop.thumbnailUrl || logo}
          alt={title}
        />

        {/* Category + Rating */}
        <div className="flex items-center mt-2 justify-between">
          <span className="inline-block text-slate-400 capitalize">
            {workshop.category}
          </span>

          <div className="flex items-center gap-1">
            <Star className="fill-amber-400 text-yellow-400 w-3 h-3" />
            <span className="text-[13px] font-medium">{instructorRating}</span>
            <span className="text-[11px] text-slate-400">
              ({instructorReviews})
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-base text-slate-900 font-medium mt-1 capitalize">
          {workshop.title}
        </h3>

        {/* Session + Price */}
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Earth className="w-5 h-5" /> {workshop.mode}
          </span>
          <p className="text-xl text-indigo-600 font-medium mt-1">
            ₹ {workshop.price}
          </p>
        </div>

        {/* Students + Button */}
        <div className="flex items-center justify-between mt-2">
          <span className="flex items-center gap-2 text-slate-600 text-sm">
            <Users className="w-4 h-4" /> {workshop.studentsCount} Enrolled
            Users
          </span>

          <Link
            href={`/workshops/${workshop.slug}`}
            className="px-4 py-1.5 rounded-md bg-primary text-white text-sm hover:bg-primary/80 active:scale-95 transition-all"
          >
            Know More
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
