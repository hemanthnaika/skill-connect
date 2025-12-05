import { profile } from "@/assets/images";
import CustomLayout from "@/components/CustomLayout";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

const Profile = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return redirect("/signIn");
  return (
    <section>
      <CustomLayout>
        <div className="max-w-4xl mx-auto mt-10 p-6 bg-white ">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Workshop Card */}
              <div className="p-4 border rounded-lg shadow-sm">
                <h3 className="font-bold">Web Development Bootcamp</h3>
                <p className="text-sm text-gray-600">Category: Programming</p>
                <p className="text-sm text-gray-500">Mode: Online</p>

                <Link
                  href="#"
                  className="text-blue-600 text-sm mt-2 inline-block"
                >
                  View Workshop →
                </Link>
              </div>

              <div className="p-4 border rounded-lg shadow-sm">
                <h3 className="font-bold">Digital Marketing Workshop</h3>
                <p className="text-sm text-gray-600">Category: Marketing</p>
                <p className="text-sm text-gray-500">Mode: Offline (Delhi)</p>

                <Link
                  href="#"
                  className="text-blue-600 text-sm mt-2 inline-block"
                >
                  View Workshop →
                </Link>
              </div>
            </div>
          </div>

          {/* Registered Workshops */}
          <div className="mt-10">
            <h2 className="text-xl font-semibold mb-3">
              Workshops You Registered For
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Registered Card */}
              <div className="p-4 border rounded-lg shadow-sm">
                <h3 className="font-bold">UI/UX Design Course</h3>
                <p className="text-sm text-gray-600">Category: Design</p>

                <Link
                  href="#"
                  className="text-blue-600 text-sm mt-2 inline-block"
                >
                  View Details →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </CustomLayout>
    </section>
  );
};

export default Profile;
