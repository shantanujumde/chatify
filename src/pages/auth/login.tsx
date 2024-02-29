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
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";

export default function LoginAccount({
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const LoginFormSchema = z.object({
    email: z.string().email("Invalid email"),
    // password: z.string().min(6, "Password must be at least 6 characters"),
  });

  const [signInLoading, setSignInLoading] = useState(false);

  type LoginFormType = z.infer<typeof LoginFormSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormType>({
    resolver: zodResolver(LoginFormSchema),
  });

  const onSubmit: SubmitHandler<LoginFormType> = async (data) => {
    setSignInLoading(true);
    const res = await signIn("email", {
      ...data,
      redirect: false,
    });

    if (res?.ok) {
      toast({
        description: "We have sent you the magic link to sign in!",
      });
      // await router.push("/");
    } else if (res?.error) {
      toast({
        variant: "destructive",
        description: "Invalid email or password",
      });
    }
    setSignInLoading(false);
  };

  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
      >
        <div
          style={{
            clipPath:
              "polygon(67.56% 94.52%, 89.76% 80.39%, 100% 100%, 89.79% 70.05%, 83.47% 93.18%, 85.8% 68.75%, 88.44% 58.88%, 77.33% 94.5%, 90.14% 100%, 54.66% 89%, 72.21% 84.69%, 100% 59.15%, 21.05% 100%, 100% 0%, 0% 100%, 60.6% 0.1%, 0.7% 65.93%, 27.34% 0.1%, 0% 31.5%, 100% 44.4%, 5.85% 100%, 70.09% 70.65%)",
          }}
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
        />
      </div>
      <div className="relative m-auto flex h-[75vh] flex-col items-center justify-center overflow-hidden align-middle">
        <div className="m-auto w-full lg:max-w-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-center text-2xl">
              Sign In / Register
            </CardTitle>
            <CardDescription className="text-center">
              Enter your email to sign in or register with the magic.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email" className="p-1">
                  Email
                </Label>
                <Input
                  id="email"
                  type="text"
                  placeholder="e.g. johndoe@gmail.com"
                  {...register("email", { required: true })}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>
              {/**
               * <div className="grid gap-2">
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
              </div> */}
              {/* <div className="flex items-center space-x-2">
              <Checkbox id="terms" />
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Remember me
              </label>
            </div> */}
            </CardContent>
            <CardFooter className="flex flex-col">
              <Button
                disabled={!isValid}
                loading={signInLoading}
                type="submit"
                className="w-full"
              >
                Login
              </Button>
            </CardFooter>
          </form>

          {Object.values(providers).length && (
            <div className="relative m-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
          )}

          <div className="flex justify-center space-x-2 px-6">
            {Object.values(providers).map((provider) => {
              if (provider.id === "credentials" || provider.id === "email")
                return;
              return (
                <Button
                  key={provider.name}
                  variant="outline"
                  className="w-full"
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
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (session) {
    return { redirect: { destination: "/" } };
  }

  const providers = await getProviders();
  console.log("🚀 ~ getServerSideProps ~ providers:", providers);

  return {
    props: { providers: providers ?? [] },
  };
}
