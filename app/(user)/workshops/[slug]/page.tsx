import { profile } from "@/assets/images";
import CourseCard from "@/components/CourseCard";
import CustomLayout from "@/components/CustomLayout";
import RegisterButton from "@/components/RegisterButton";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { serverFetch } from "@/lib/server-fetch";
import {
  CalendarDays,
  ChevronRight,
  Clock,
  Globe,
  GraduationCap,
  Home,
  IndianRupee,
  Layers,
  MapPin,
  Star,
} from "lucide-react";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
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

const Details = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;

  const { workshop, relatedWorkshops } = await serverFetch<WorkshopResponse>({
    url: `workshop/${slug}`,
  });
  const session = await auth.api.getSession({
    headers: await headers(),
  });


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
            <Link href="#">{workshop.category}</Link>
            <ChevronRight className="text-gray" />
            <Link href="#">{workshop.title}</Link>
          </div>

          <div className="flex flex-col-reverse md:flex-row gap-5 mt-5 w-full">
            <div className="w-full">
              {/* Title */}
              <h1 className="text-3xl tracking-wider font-semibold">
                {workshop.title}
              </h1>

              <span className="font-medium text-slate-600">
                {workshop.category}
              </span>

              {/* Instructor */}
              <div className="flex gap-2 mt-5">
                <Image
                  src={workshop.creator.image || profile}
                  alt="profile image"
                  width={50}
                  height={50}
                  className="rounded-full"
                />
                <div>
                  <h2 className="font-bold">{workshop.creator.name}</h2>
                  <span className="text-slate-500 text-sm font-medium">
                    {workshop.creator.email}
                  </span>
                </div>
              </div>

              {/* Primary Stats */}
              <div className="flex  items-center justify-between bg-white px-5 py-3 rounded-lg mt-5">
                <Info
                  icon={<Star className="text-yellow-500 w-5 h-5" />}
                  info={workshop.rating}
                />
                <Info
                  icon={<GraduationCap className="text-black w-5 h-5" />}
                  info={workshop.studentsCount}
                />
                <Info
                  icon={<Globe className="text-black w-5 h-5" />}
                  info={workshop.language}
                />
                <Info
                  icon={<IndianRupee className="text-black w-5 h-5" />}
                  info={workshop.price}
                />
              </div>

              {/* Extra Info Section */}
              <div className="bg-white mt-5 p-5 rounded-xl space-y-3">
                <div className="flex items-center gap-3">
                  <CalendarDays className="w-5 h-5 text-primary" />
                  <span className="font-semibold">Date: {workshop.date}</span>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-primary" />
                  <span className="font-semibold">
                    Duration: {workshop.duration}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <Layers className="w-5 h-5 text-primary" />
                  <span className="font-semibold">Level: {workshop.level}</span>
                </div>

                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-primary" />
                  <span className="font-semibold">
                    Mode:{" "}
                    {workshop.mode === "online"
                      ? "Online (Google Meet / Zoom)"
                      : "Offline Event"}
                  </span>
                </div>

                {workshop.mode === "offline" && (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary mt-1" />
                    <span className="font-semibold leading-tight">
                      Address: <br /> {workshop.address}
                    </span>
                  </div>
                )}
              </div>

              {/* Button */}
              {session?.user ? (
                <RegisterButton
                  userId={session.user.id}
                  slug={workshop.slug}
                  price={workshop.price}
                  workshopId={workshop.id}
                />
              ) : (
                <Link href={"/login"}>
                  <Button variant="default" className="mt-5 text-white">
                    Register Now
                  </Button>
                </Link>
              )}
            </div>

            {/* Right Image */}
            <div className="relative w-full aspect-4/3 md:aspect-video">
              <Image
                src={workshop.thumbnailUrl}
                alt="Workshop Image"
                fill
                priority
                className="rounded-xl object-cover"
              />
            </div>
          </div>
          <div className="bg-white mt-5 p-5 rounded-xl">
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-slate-600 leading-relaxed text-sm">
              {workshop.description}
            </p>
          </div>
        </CustomLayout>
      </div>
      <CustomLayout>
        {/* ---------------- Related Courses Section ---------------- */}

        <h3 className="text-lg font-semibold mb-3 mt-5">Related Courses</h3>
        <div className="flex flex-wrap gap-5 w-full justify-center">
          {relatedWorkshops.map((workshop) => (
            <CourseCard key={workshop.id} workshop={workshop} />
          ))}
        </div>
      </CustomLayout>
    </section>
  );
};

export default Details;
