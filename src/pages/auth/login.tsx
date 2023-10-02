/* eslint-disable @typescript-eslint/no-misused-promises */
"use client";

import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Icons } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { authOptions } from "@/server/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  type GetServerSidePropsContext,
  type InferGetServerSidePropsType,
} from "next";
import { getServerSession } from "next-auth";
import { getProviders, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";

export default function LoginAccount({
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const LoginFormSchema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  });

  type LoginFormType = z.infer<typeof LoginFormSchema>;

  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormType>({
    resolver: zodResolver(LoginFormSchema),
  });

  const onSubmit: SubmitHandler<LoginFormType> = async (data) => {
    const res = await signIn("credentials", {
      ...data,
      redirect: false,
    });

    if (res?.ok) {
      await router.push("/");
    } else {
      toast({
        variant: "destructive",
        description: "Invalid email or password",
      });
    }
  };

  return (
    <div className="relative m-auto flex flex-col items-center justify-center overflow-hidden">
      <div className="m-auto w-full lg:max-w-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-center text-2xl">Sign in</CardTitle>
          <CardDescription className="text-center">
            Enter your email and password to login
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="text"
                placeholder="email"
                {...register("email", { required: true })}
              />
              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                {...register("password", { required: true })}
              />
              {errors.password && (
                <p className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="terms" />
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Remember me
              </label>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button disabled={!isValid} type="submit" className="w-full">
              Login
            </Button>
          </CardFooter>
        </form>
        <div className="relative mb-2">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        <div className="m-2 grid grid-cols-2 gap-6">
          {Object.values(providers).map((provider) => {
            if (provider.id === "credentials") return;
            return (
              <Button
                key={provider.name}
                variant="outline"
                onClick={() => signIn(provider.name.toLowerCase())}
              >
                {provider.id === "discord" ? (
                  <Icons.twitter className="mr-2 h-4 w-4" />
                ) : provider.id === "google" ? (
                  <Icons.google className="mr-2 h-4 w-4" />
                ) : (
                  <Icons.logo className="mr-2 h-4 w-4" />
                )}
                {provider.name}
              </Button>
            );
          })}
        </div>
        <p className="mb-2 mt-2 text-center text-xs text-gray-700">
          Don&apos;t have an account?{" "}
          <span
            className=" text-blue-600 hover:underline"
            onClick={() => router.push("/auth/register")}
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (session) {
    return { redirect: { destination: "/" } };
  }

  const providers = await getProviders();

  return {
    props: { providers: providers ?? [] },
  };
}
