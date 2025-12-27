import CustomLayout from "@/components/CustomLayout";
import SigInForm from "@/components/form/sigInForm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Image from "next/image";
import { redirect } from "next/navigation";

const SigIn = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (session) {
    redirect("/profile");
  }
  return (
    <section className="pt-12">
      <CustomLayout>
        <div className="flex h-[500px] w-full mt-12">
          <div className="w-full hidden md:inline-block">
            <Image
              className="h-full w-full object-center rounded-xl"
              src={
                "https://images.unsplash.com/photo-1513258496099-48168024aec0?q=80&w=1170&auto=format&fit=crop"
              }
              width={500}
              height={500}
              alt="SkillConnect SigIn Banner"
            />
          </div>
          <SigInForm />
        </div>
      </CustomLayout>
    </section>
  );
};

export default SigIn;
