"use client";
import { google } from "@/assets/images";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { authClient } from "@/lib/auth-client";

import toast from "react-hot-toast";
import { useState } from "react";
import { Loader, Lock, Mail } from "lucide-react";

const formSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email address")
    .nonempty("Email is required"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .nonempty("Password is required"),
});

const SigInForm = () => {
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/profile",
      });

      return {
        success: true,
        message: "Google Sign-in successful!",
      };
    } catch (error) {
      const e = error as Error;
      return {
        success: false,
        message: e?.message || "Google Sign-in failed",
      };
    } finally {
      setLoading(false);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    await authClient.signIn.email(
      {
        email: values.email,
        password: values.password,
        callbackURL: "/dashboard",
      },
      {
        onSuccess: () => {
          setLoading(false);
          toast.success("Signed in successfully!");
        },
        onError: (ctx) => {
          // display the error message
          toast.error(ctx.error.message);
        },
      }
    );
    setLoading(false);
  }

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div className="md:w-96 w-80 flex flex-col items-center justify-center">
        <h2 className="text-4xl text-gray-900 font-medium">Welcome Back</h2>
        <p className="text-sm text-gray-500/90 mt-3">
          Sign in to continue your learning journey on SkillConnect
        </p>

        {/* Google SigIn Button */}
        <Button
          disabled={loading}
          onClick={signInWithGoogle}
          type="button"
          variant="default"
          className="flex items-center gap-3 mt-5 bg-gray-500/10 px-5 py-2 rounded-full hover:bg-gray-500/10 cursor-pointer"
        >
          <Image
            src={google}
            width={20}
            alt="google"
            className="rounded-full"
          />
          <span className="text-sm">Sign In with Google </span>
        </Button>

        <div className="flex items-center gap-4 w-full my-5">
          <div className="w-full h-px bg-gray-300/90"></div>
          <p className="w-full text-nowrap text-sm text-gray-500/90">
            or sign in with email
          </p>
          <div className="w-full h-px bg-gray-300/90"></div>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5 w-full"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex items-center w-full bg-transparent border border-gray-300/60 h-10 rounded-full overflow-hidden pl-6 gap-2 focus-within:border-indigo-500">
                      {/* Icon */}
                      <Mail className="w-5 h-5 text-gray-500 " />
                      {/* Input */}
                      <Input
                        {...field}
                        disabled={loading}
                        placeholder="Enter your email address"
                        className="bg-transparent text-gray-500/80 placeholder-gray-500/80 outline-none text-sm w-full h-full border-none shadow-none focus-visible:ring-0"
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex items-center w-full bg-transparent border border-gray-300/60 h-10 rounded-full overflow-hidden pl-6 gap-2 focus-within:border-indigo-500">
                      {/* Icon */}
                      <Lock className="w-5 h-5 text-gray-500 " />
                      {/* Input */}
                      <Input
                        {...field}
                        disabled={loading}
                        placeholder="Enter your password"
                        className="bg-transparent text-gray-500/80 placeholder-gray-500/80 outline-none text-sm w-full h-full border-none shadow-none focus-visible:ring-0"
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <Button
              disabled={loading}
              type="submit"
              className=" w-full h-11 rounded-full text-white bg-indigo-500 hover:opacity-90 transition-opacity hover:bg-indigo-500/90"
            >
              {loading ? <Loader className="animate-spin" /> : "Sign In"}
            </Button>
          </form>
        </Form>

        <p className="text-gray-500/90 text-sm mt-4">
          Don’t have an account?{" "}
          <Link className="text-indigo-400 hover:underline" href="/signUp">
            Create a SkillConnect account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SigInForm;
