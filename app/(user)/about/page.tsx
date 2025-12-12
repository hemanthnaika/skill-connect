import CustomLayout from "@/components/CustomLayout";
import Image from "next/image";
import { Users, Star, Sparkles, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const About = () => {
  return (
    <section className="py-10">
      <CustomLayout>
        {/* Hero Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl font-bold leading-tight">
              Empowering Skills,
              <span className="text-primary"> Connecting People.</span>
            </h1>
            <p className="text-slate-600 mt-4">
              SkillConnect is a platform that brings learners, creators, and
              professional mentors together through live workshops, skill-based
              sessions, and community learning. Whether online or offline, we
              create meaningful learning experiences for everyone.
            </p>

            <div className="flex items-center gap-6 mt-6">
              <div className="flex items-center gap-2">
                <Users className="text-primary w-5 h-5" />
                <span className="text-slate-700 font-medium">
                  10,000+ Learners
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Star className="text-yellow-500 w-5 h-5" />
                <span className="text-slate-700 font-medium">
                  4.8 Average Rating
                </span>
              </div>
            </div>

            <Link href="/register">
              <Button className="mt-6 text-white">Join SkillConnect</Button>
            </Link>
          </div>

          <div>
            <Image
              src="https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1200&q=60"
              alt="About SkillConnect"
              width={600}
              height={500}
              className="rounded-xl shadow-md"
            />
          </div>
        </div>

        {/* Mission Section */}
        <div className="mt-16 text-center">
          <h2 className="text-3xl font-semibold">Our Mission</h2>
          <p className="text-slate-600 mt-3 max-w-2xl mx-auto">
            To make learning accessible, interactive, and community-driven —
            enabling people to grow their skills through expert-led workshops,
            both online and offline.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-14">
          <div className="p-6 border rounded-xl hover:shadow-md transition">
            <Sparkles className="w-10 h-10 text-primary mb-3" />
            <h3 className="font-semibold text-lg">Expert-Led Sessions</h3>
            <p className="text-slate-600 mt-2">
              Learn directly from industry professionals and verified mentors.
            </p>
          </div>

          <div className="p-6 border rounded-xl hover:shadow-md transition">
            <CheckCircle className="w-10 h-10 text-primary mb-3" />
            <h3 className="font-semibold text-lg">Hands-on Workshops</h3>
            <p className="text-slate-600 mt-2">
              Practical and interactive workshops that focus on real skills.
            </p>
          </div>

          <div className="p-6 border rounded-xl hover:shadow-md transition">
            <Users className="w-10 h-10 text-primary mb-3" />
            <h3 className="font-semibold text-lg">Community Learning</h3>
            <p className="text-slate-600 mt-2">
              Connect, collaborate, and grow with skill-focused communities.
            </p>
          </div>
        </div>

        {/* Team Section */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-semibold">Behind SkillConnect</h2>
          <p className="text-slate-600 mt-3 max-w-2xl mx-auto">
            Our team is passionate about empowering people through accessible
            learning and creating a platform where knowledge flows freely.
          </p>

          <Image
            src="https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=1200&q=60"
            width={900}
            height={500}
            alt="Team"
            className="rounded-xl mx-auto mt-10 shadow-md"
          />
        </div>
      </CustomLayout>
    </section>
  );
};

export default About;
