import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

const SideNavBar = () => {
  const { data } = useSession();
  const user = data?.user;

  return (
    <nav className="top-0 mr-10 px-2 py-2">
      <ul className="flex flex-col space-y-4 py-8 font-bold ">
        <li>
          <Link href="/" className="border-none p-4  text-gray-700">
            Home
          </Link>
        </li>
        <li>
          <Link href="/about" className="border-none p-4  text-gray-700">
            About
          </Link>
        </li>
        <li>
          <Link href="/about" className="border-none p-4  text-gray-700">
            Contact us
          </Link>
        </li>
        {!user ? (
          <>
            <li>
              <Link
                href="/auth/register"
                className="border-none p-4 py-0 text-gray-700"
              >
                Register
              </Link>
            </li>
            <li>
              {/* built in */}
              {/* <button 
                onClick={() => void signIn()}
                className="border-none p-4 py-0 text-gray-700"
              >
                Login
              </button> */}

              {/* custom */}
              <Link
                href="/auth/login"
                className="border-none p-4 py-0 text-gray-700"
              >
                Login
              </Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link
                href={`/profile/${user.id}`}
                className="border-none p-4  text-gray-700"
              >
                Profile
              </Link>
            </li>
            <li>
              <button
                onClick={() => void signOut()}
                className="border-none p-4 py-0 text-gray-700"
              >
                Logout
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default SideNavBar;
