import CustomLayout from "@/components/CustomLayout";
import SignUpForm from "@/components/form/signUpForm";
import Image from "next/image";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const SignUp = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (session) {
    redirect("/dashboard");
  }
  return (
    <CustomLayout>
      <div className="flex h-[500px] w-full my-10">
        {/* Left Banner Image */}
        <div className="w-full hidden md:inline-block ">
          <Image
            className="h-full w-full  rounded-xl"
            src="https://images.pexels.com/photos/4144222/pexels-photo-4144222.jpeg"
            width={500}
            height={500}
            alt="SkillConnect SignUp Banner"
          />
        </div>

        <SignUpForm />
      </div>
    </CustomLayout>
  );
};

export default SignUp;
