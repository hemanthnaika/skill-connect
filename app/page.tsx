import { about } from "@/assets/images";
import CustomLayout from "@/components/CustomLayout";
import Hero from "@/components/home/Hero";
import { Button } from "@/components/ui/button";
import { Categories } from "@/constants";
import { CircleCheck } from "lucide-react";
import Image from "next/image";

interface FeaturesProps {
  name: string;
}
const Features = ({ name }: FeaturesProps) => (
  <div className="flex items-center gap-5">
    <CircleCheck className="text-primary" />
    <span className="text-lg font-bold">{name}</span>
  </div>
);
const Home = () => {
  return (
    <main>
      <Hero />
      <CustomLayout>
        <h1 className="mt-10 text-2xl font-bold">Top Categories</h1>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-5 mt-5">
          {Categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.name}
                className="flex flex-col gap-2 items-center justify-center bg-gray-50 shadow-lg px-10 py-10 rounded-md w-full h-48 transition delay-150 duration-300 ease-in-out hover:-translate-y-2"
              >
                <Icon className="w-8 h-8 mb-2 text-primary" />

                <h2 className="text-xl font-bold text-center">{cat.name}</h2>
              </div>
            );
          })}
        </div>
      </CustomLayout>

      <div className="bg-secondary mt-10 py-10">
        <CustomLayout>
          <div className="flex gap-5 flex-col-reverse md:flex-row ">
            <div className="flex-1 flex flex-col gap-6">
              <h1 className="text-4xl font-bold">Why Learn on SkillConnect?</h1>
              <p className="font-medium text-sm/ text-slate-500">
                SkillConnect brings people together to exchange skills through
                live workshops, hands-on sessions, and community learning.
                Whether you want to learn something new or share what you know,
                SkillConnect gives you the tools to grow.
              </p>

              <div className="flex flex-col gap-3">
                <Features name={"Join Live Skill Workshops"} />
                <Features name={"Learn or Teach Any Skill"} />
                <Features name={"Connect With the Community"} />
                <Features name={"Track Your Learning Progress"} />
              </div>
              <Button className="w-32 text-white">Learn More</Button>
            </div>
            <div className="flex justify-end ">
              <Image
                src={about}
                alt="hero Image"
                width={500}
                className="rounded-2xl"
              />
            </div>
          </div>
        </CustomLayout>
      </div>
    </main>
  );
};

export default Home;
