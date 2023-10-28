import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { api } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@radix-ui/react-label";
import { useRouter } from "next/router";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";

const Register = ({}) => {
  const router = useRouter();

  const { mutate: registerUser, isLoading: registerUserIsLoading } =
    api.nextauth.registerUser.useMutation({
      onSuccess: async () => {
        toast({
          variant: "default",
          description: "User registered success, please sign in",
        });
        await router.push("/auth/login");
      },
      onError() {
        toast({
          variant: "destructive",
          description: "User already registered",
        });
      },
    });

  const RegisterFormSchema = z.object({
    name: z.string().nonempty("Please enter your name"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  });
  type RegisterFormType = z.infer<typeof RegisterFormSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<RegisterFormType>({
    resolver: zodResolver(RegisterFormSchema),
  });

  const onSubmit: SubmitHandler<RegisterFormType> = (data): void => {
    registerUser(data);
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
      <div className="relative m-auto flex h-[85vh] flex-col items-center justify-center overflow-hidden align-middle">
        <div className="m-auto w-full lg:max-w-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-center text-2xl">Register</CardTitle>
            <CardDescription className="text-center">
              Enter your name, email and password to register
            </CardDescription>
          </CardHeader>
          {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
          <form onSubmit={handleSubmit((data) => onSubmit(data))}>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  {...register("name", { required: true })}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="text"
                  placeholder="e.g john@gmail.com"
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
            </CardContent>
            <CardFooter className="flex flex-col">
              <Button
                disabled={!isValid}
                type="submit"
                loading={registerUserIsLoading}
                className="w-full"
              >
                Register
              </Button>
            </CardFooter>
          </form>
        </div>
      </div>
    </>
  );
};

export default Register;
