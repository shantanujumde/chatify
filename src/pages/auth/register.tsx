import { api } from "@/utils/api";
import { useRef } from "react";

const Register = ({}) => {
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const register = api.nextauth.registerUser.useMutation();

  const registerUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const name = nameRef.current?.value;
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;

    if (email && name && password) register.mutate({ name, email, password });
  };

  return (
    <form onSubmit={registerUser}>
      <input type="text" ref={nameRef} placeholder="Name" />
      <input type="text" ref={emailRef} placeholder="Email" />
      <input type="password" ref={passwordRef} placeholder="Password" />

      <button>Register</button>
    </form>
  );
};

export default Register;
