"use client";
import { google } from "@/assets/images";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { authClient } from "@/lib/auth-client";

import toast from "react-hot-toast";
import { Loader, Lock, Mail, User } from "lucide-react";

const formSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters long")
    .nonempty("Name is required"),
  email: z
    .string()
    .email("Please enter a valid email address")
    .nonempty("Email is required"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .nonempty("Password is required"),
});

const SignUpForm = () => {
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
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
    await authClient.signUp.email(
      {
        email: values.email,
        password: values.password,
        name: values.name,
        callbackURL: "/profile",
      },
      {
        onSuccess: () => {
          setLoading(false);
          toast.success("Signed up successfully!");
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
        <h2 className="text-4xl text-gray-900 font-medium">Create Account</h2>
        <p className="text-sm text-gray-500/90 mt-3">
          Join SkillConnect and start learning live!
        </p>
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
          <span className="text-sm">Sign up with Google </span>
        </Button>

        {/* Divider */}
        <div className="flex items-center gap-4 w-full my-5">
          <div className="w-full h-px bg-gray-300/90"></div>
          <p className="w-full text-nowrap text-sm text-gray-500/90">
            or Sign up with email
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex items-center w-full bg-transparent border border-gray-300/60 h-10 rounded-full overflow-hidden pl-6 gap-2 focus-within:border-indigo-500">
                      {/* Icon */}
                      <User className="w-5 h-5 " />
                      {/* Input */}
                      <Input
                        {...field}
                        disabled={loading}
                        placeholder="Full Name"
                        className="bg-transparent text-gray-500/80 placeholder-gray-500/80 outline-none text-sm w-full h-full border-none shadow-none focus-visible:ring-0"
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex items-center w-full bg-transparent border border-gray-300/60 h-10 rounded-full overflow-hidden pl-6 gap-2 focus-within:border-indigo-500">
                      {/* Icon */}
                      <Mail className="w-5 h-5 text-gray-500" />
                      {/* Input */}
                      <Input
                        {...field}
                        disabled={loading}
                        placeholder="Full Name"
                        className="bg-transparent text-gray-500/80 placeholder-gray-500/80 outline-none text-sm w-full h-full border-none shadow-none focus-visible:ring-0"
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            {/* Password Field */}
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
                        placeholder="Full Name"
                        className="bg-transparent text-gray-500/80 placeholder-gray-500/80 outline-none text-sm w-full h-full border-none shadow-none focus-visible:ring-0"
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            {/* Terms */}
            <div className="w-full flex items-center justify-between mt-6 text-gray-500/80">
              <div className="flex items-center gap-2">
                <input className="h-5" type="checkbox" id="terms" required />
                <label className="text-sm" htmlFor="terms">
                  I agree to the Terms & Privacy Policy
                </label>
              </div>
            </div>

            {/* Submit */}
            <Button
              disabled={loading}
              type="submit"
              className="mt-8 w-full h-11 rounded-full text-white bg-indigo-500 hover:opacity-90 transition-opacity"
            >
              {loading ? <Loader className="animate-spin" /> : "Sign Up"}
            </Button>
          </form>
        </Form>
        <p className="text-gray-500/90 text-sm mt-4">
          Already have an account?{" "}
          <Link className="text-indigo-400 hover:underline" href="/signIn">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpForm;
