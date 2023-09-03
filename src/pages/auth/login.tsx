import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useRef } from "react";

const Login = ({}) => {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const loginUser = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;
    try {
      if (email && password)
        await signIn("credentials", {
          redirect: false,
          email,
          password,
        });
    } catch (e) {
      console.error();
    }

    await router.push("/");
  };

  return (
    <form onSubmit={(e) => void loginUser(e)}>
      <input type="text" ref={emailRef} placeholder="Email" />
      <input type="password" ref={passwordRef} placeholder="Password" />

      <button>Login</button>
    </form>
  );
};

export default Login;
