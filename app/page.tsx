import { hero } from "@/assets/images";
import CustomLayout from "@/components/CustomLayout";
import Hero from "@/components/home/Hero";
import { Categories } from "@/constants";
import Image from "next/image";

const Home = () => {
  return (
    <main>
      <Hero />
      <CustomLayout>
        <h1 className="mt-10 text-2xl font-bold">Top Categories</h1>
        <div className="grid grid-cols-5 gap-5 mt-5">
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

        <div className="mt-5 flex gap-5 ">
          <div>1</div>
          <div>
            <Image src={hero} alt="hero Image" width={500} />
          </div>
        </div>
      </CustomLayout>
    </main>
  );
};

export default Home;
