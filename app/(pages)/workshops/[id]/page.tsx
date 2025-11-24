import { about, profile } from "@/assets/images";
import CourseCard from "@/components/CourseCard";
import CustomLayout from "@/components/CustomLayout";
import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  Globe,
  GraduationCap,
  IndianRupee,
  Star,
  Home,
  MapPin,
  CalendarDays,
  Clock,
  Layers,
} from "lucide-react";
import Image from "next/image";
import { ReactNode } from "react";

interface InfoProps {
  icon: ReactNode;
  info: string | number;
}

const Info = ({ icon, info }: InfoProps) => (
  <div className="flex flex-wrap  items-center gap-2 border-r border-gray-300 pr-3 md:pr-5 pl-3 md:pl-5">
    {icon}
    <span className="font-bold text-sm">{info}</span>
  </div>
);

const Details = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  const offlineAddress =
    "SkillConnect Creative Hub, 3rd Floor, MG Road, Bengaluru, India";

  const workshopDetails = {
    workshopMode: "Offline",
    title: "Live Beginner Guitar Workshop",
    category: "Music & Performance",
    instructor: "Alex Johnson",
    role: "Skill Mentor (Guitar Expert)",
    rating: "4.9",
    participants: "350 Participants",
    language: "English",
    price: "1499",
    date: "25 Nov 2025",
    duration: "2 Hours",
    level: "Beginner Friendly",
    contact: "support@skillconnect.com",
  };

  return (
    <section>
      <div className="bg-secondary py-5">
        <CustomLayout>
          {/* Breadcrumb */}
          <div className="flex flex-wrap items-center space-x-2 text-sm text-gray-500 font-medium pt-5">
            <button type="button" aria-label="Home">
              <Home className="text-primary w-5 h-5" />
            </button>
            <ChevronRight className="text-gray" />
            <a href="#">{workshopDetails.category}</a>
            <ChevronRight className="text-gray" />
            <a href="#">{workshopDetails.title}</a>
          </div>

          <div className="flex flex-col-reverse md:flex-row gap-5 mt-5 w-full">
            <div className="w-full">
              {/* Title */}
              <h1 className="text-3xl tracking-wider font-semibold">
                {workshopDetails.title}
              </h1>

              <span className="font-medium text-slate-600">
                {workshopDetails.category}
              </span>

              {/* Instructor */}
              <div className="flex gap-2 mt-5">
                <Image
                  src={profile}
                  alt="profile image"
                  width={50}
                  height={50}
                  className="rounded-full"
                />
                <div>
                  <h2 className="font-bold">{workshopDetails.instructor}</h2>
                  <span className="text-slate-500 text-sm font-medium">
                    {workshopDetails.role}
                  </span>
                </div>
              </div>

              {/* Primary Stats */}
              <div className="flex  items-center justify-between bg-white px-5 py-3 rounded-lg mt-5">
                <Info
                  icon={<Star className="text-yellow-500 w-5 h-5" />}
                  info={workshopDetails.rating}
                />
                <Info
                  icon={<GraduationCap className="text-black w-5 h-5" />}
                  info={workshopDetails.participants}
                />
                <Info
                  icon={<Globe className="text-black w-5 h-5" />}
                  info={workshopDetails.language}
                />
                <Info
                  icon={<IndianRupee className="text-black w-5 h-5" />}
                  info={workshopDetails.price}
                />
              </div>

              {/* Extra Info Section */}
              <div className="bg-white mt-5 p-5 rounded-xl space-y-3">
                <div className="flex items-center gap-3">
                  <CalendarDays className="w-5 h-5 text-primary" />
                  <span className="font-semibold">
                    Date: {workshopDetails.date}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-primary" />
                  <span className="font-semibold">
                    Duration: {workshopDetails.duration}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <Layers className="w-5 h-5 text-primary" />
                  <span className="font-semibold">
                    Level: {workshopDetails.level}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-primary" />
                  <span className="font-semibold">
                    Mode:{" "}
                    {workshopDetails.workshopMode === "Online"
                      ? "Online (Google Meet / Zoom)"
                      : "Offline Event"}
                  </span>
                </div>

                {workshopDetails.workshopMode === "Offline" && (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary mt-1" />
                    <span className="font-semibold leading-tight">
                      Address: <br /> {offlineAddress}
                    </span>
                  </div>
                )}
              </div>

              {/* Button */}
              <Button variant="default" className="mt-5 text-white">
                Register Now
              </Button>
            </div>

            {/* Right Image */}
            <div className="w-full flex h-1/2">
              <Image
                src={about}
                alt="Workshop Image"
                width={500}
                height={500}
                className="rounded-xl w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="bg-white mt-5 p-5 rounded-xl">
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-slate-600 leading-relaxed text-sm">
              Join our{" "}
              <span className="font-semibold">Beginner Guitar Workshop</span>{" "}
              designed especially for new learners who want to start their
              musical journey. In this interactive session, you will learn
              essential guitar techniques, basic chords, strumming patterns, and
              tips to improve your hand coordination. Our expert instructor will
              guide you step-by-step and help you build a strong foundation in a
              friendly and supportive environment. No prior experience required!
            </p>
          </div>
        </CustomLayout>
      </div>
      <CustomLayout>
        {/* ---------------- Related Courses Section ---------------- */}

        <h3 className="text-lg font-semibold mb-3 mt-5">Related Courses</h3>
        <div className="flex flex-wrap gap-5 w-full justify-center">
          <CourseCard />
          <CourseCard />
          <CourseCard />
          <CourseCard />
          <CourseCard />
        </div>
      </CustomLayout>
    </section>
  );
};

export default Details;
