import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { ModeToggle } from "./mode";

const SideNavBar = () => {
  const { data } = useSession();
  const user = data?.user;

  return (
    <nav className="top-0 mr-10 px-2 py-2">
      <ul className="flex flex-col items-center justify-center space-y-4 py-8 font-bold">
        <li className="duration-400 transition animate-in hover:scale-125">
          <Link href="/" className="border-none p-4 ">
            Home
          </Link>
        </li>
        <li className="duration-400 transition animate-in hover:scale-125">
          <Link href="/about" className="border-none p-4 ">
            About
          </Link>
        </li>
        <li className="duration-400 transition animate-in hover:scale-125">
          <Link href="/about" className="border-none p-4 ">
            Contact us
          </Link>
        </li>
        {!user ? (
          <>
            <li className="duration-400 transition animate-in hover:scale-125">
              <Link href="/auth/register" className="border-none p-4 py-0">
                Register
              </Link>
            </li>
            <li className="duration-400 transition animate-in hover:scale-125">
              {/* built in */}
              {/* <button 
                onClick={() => void signIn()}
                className="border-none p-4 py-0"
              >
                Login
              </button> */}

              {/* custom */}
              <Link href="/auth/login" className="border-none p-4 py-0">
                Login
              </Link>
            </li>
          </>
        ) : (
          <>
            <li className="duration-400 transition animate-in hover:scale-125">
              <Link href={`/profile/${user.id}`} className="border-none p-4 ">
                Profile
              </Link>
            </li>
            <li className="duration-400 transition animate-in hover:scale-125">
              <button
                onClick={() => void signOut()}
                className="border-none p-4 py-0"
              >
                Logout
              </button>
            </li>
          </>
        )}
        <li className="duration-400 transition animate-in hover:scale-125">
          <ModeToggle />
        </li>
      </ul>
    </nav>
  );
};

export default SideNavBar;
