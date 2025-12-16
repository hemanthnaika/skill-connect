import { profile } from "@/assets/images";
import CourseCard from "@/components/CourseCard";
import CustomLayout from "@/components/CustomLayout";
import { auth } from "@/lib/auth";
import { serverFetch } from "@/lib/server-fetch";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

const Profile = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return redirect("/signIn");
  // http://localhost:3000/api/users/L3USi2X66cZpFhIBegzYX3zctsqXJ1cp/profile
  const res = await serverFetch<ProfileResponse>({
    url: `users/${session.user?.id}/profile`,
  });

  return (
    <section>
      <CustomLayout>
        <div className=" mt-10  bg-white ">
          {/* Header Section */}
          <div className="flex items-center gap-4">
            <Image
              src={session.user?.image || profile}
              alt="profile"
              width={80}
              height={80}
              className="rounded-full"
            />

            <div>
              <h1 className="text-2xl font-bold">{session.user?.name}</h1>
              <p className="text-gray-600">{session.user?.email}</p>
            </div>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-gray-200 my-5"></div>

          <Link
            href="/workshops/conductWorkshop"
            className="px-6 py-3 bg-primary/90 text-white rounded-full font-medium hover:bg-primary transition"
          >
            Conduct a Workshop
          </Link>

          {/* Created Workshops */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-3">
              Workshops You Created
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-5">
              {res.conductedWorkshops.map((workshop, i) => (
                <CourseCard key={i} workshop={workshop} />
              ))}
            </div>
          </div>

          {/* Registered Workshops */}
          <div className="mt-10">
            <h2 className="text-xl font-semibold mb-3">
              Workshops You Registered For
            </h2>

           
              {/* Registered Card */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-5">
                {res.joinedWorkshops.map((workshop, i) => (
                  <CourseCard key={i} workshop={workshop} />
                ))}
              </div>
            
          </div>
        </div>
      </CustomLayout>
    </section>
  );
};

export default Profile;
