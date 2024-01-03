"use client";
import EmptyItems from "@/components/emptyItems";
import Spinner from "@/components/ui/spinner";
import { api } from "@/utils/api";
import { format } from "date-fns";
import { UserCircle2Icon } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Skeleton from "react-loading-skeleton";

const Profile = ({ params }: { params: { userId: string } }) => {
  const router = useRouter();

  const { data: sessionData, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/auth/login");
    },
  });
  const id = params.userId;

  const { isLoading: profileIsLoading, data: profile } =
    api.profile.getUser.useQuery(
      { id: String(id) },
      { enabled: sessionData?.user !== undefined }
    );

  if (status === "loading" || profileIsLoading) return <Spinner />;

  if (!profile)
    return (
      <EmptyItems
        title="Something went wrong!"
        description="Profile page cannot be accessed at this time, please contact admin"
      />
    );

  return (
    <section className="pt-16 ">
      <div className=" mx-auto w-full px-4 lg:w-1/2">
        <div className="relative mb-6  mt-16 flex w-full min-w-0 flex-col break-words rounded-lg bg-white shadow-xl dark:border dark:border-gray-400 dark:bg-transparent dark:shadow-white">
          <div className="px-6">
            <div className="flex flex-wrap justify-center">
              <div className="flex w-full justify-center px-4">
                <div className="relative">
                  <div className="-mt-20 rounded-full border-none bg-white object-none text-center align-middle shadow-xl dark:border dark:border-gray-400 dark:bg-gray-800 dark:text-white dark:shadow-gray-500">
                    {sessionData.user?.image ? (
                      <Image
                        alt="profile pic"
                        src={sessionData.user.image}
                        width={240}
                        height={240}
                        className="rounded-full"
                      />
                    ) : (
                      <UserCircle2Icon className="h-60 w-60" />
                    )}
                  </div>
                </div>
              </div>
              <Link
                className="mt-4 text-xl font-bold text-blue-600"
                href={`/profile/${sessionData.user.id}/edit`}
              >
                Edit
              </Link>
              <div className="mt-20 w-full px-4 text-center">
                <div className="flex justify-center py-4 pt-8 lg:pt-4">
                  <div className="mr-4 p-3 text-center">
                    <span className="block text-xl font-bold uppercase tracking-wide text-primary">
                      {profile.documentsCount}
                    </span>
                    <span className="text-sm text-primary/40">Files</span>
                  </div>
                  <div className="mr-4 p-3 text-center">
                    <span className="block text-xl font-bold uppercase tracking-wide text-primary">
                      ≤ {profile.chatsCount}
                    </span>
                    <span className="text-sm text-primary/40">Chats</span>
                  </div>
                  <div className="p-3 text-center lg:mr-4">
                    <span className="block text-xl font-bold uppercase tracking-wide text-primary">
                      {profile.user?.createdAt
                        ? format(profile.user.createdAt, "dd MMM yy")
                        : null}
                    </span>
                    <span className="text-sm text-primary/40">Joined On</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-12 text-center">
              <h3 className="text-blueGray-700 mb-2  text-xl font-semibold leading-normal">
                {profile.user?.name?.toLocaleUpperCase()}
              </h3>
              <div className="text-blueGray-400 mb-2 mt-0 text-sm font-bold leading-normal">
                <i className="fas fa-map-marker-alt text-blueGray-400 mr-2 text-lg"></i>
                {profile.user?.email?.toLocaleLowerCase()}
              </div>
              <div className="text-blueGray-600 mb-2 mt-10">
                <i className="fas fa-briefcase text-blueGray-400 mr-2 text-lg"></i>
                Knowledge base of{" "}
                <span className="font-semibold text-primary">
                  {profile.documentsCount}
                </span>{" "}
                files
              </div>
              <div className="text-blueGray-600 mb-2">
                <i className="fas fa-university text-blueGray-400 mr-2 text-lg"></i>
                {profile.organization?.name}
              </div>
            </div>

            <div className="flex flex-col justify-center py-4">
              <span className="py-2 text-center text-sm text-primary/40">
                Members from your organization
              </span>

              <ol
                className={`
          scrollbar-thumb-black scrollbar-track-black-lighter  
          dark:scrollbar-thumb-white dark:scrollbar-track-white-lighter 
          scrollbar-thumb-rounded 
         scrollbar-w-2 scrolling-touch h-40 
        max-h-screen overflow-y-scroll scroll-smooth rounded-xl bg-gray-300/5 p-6`}
              >
                {profileIsLoading ? (
                  <Skeleton
                    count={10}
                    baseColor="#7a7a7a"
                    highlightColor="#fff"
                    height="2rem"
                    borderRadius="1rem"
                  />
                ) : !profile.organization?.users?.length ? (
                  <EmptyItems />
                ) : (
                  profile.organization.users.map((user) => (
                    <li
                      key={user.id}
                      className="mt-1 cursor-pointer truncate rounded-2xl bg-gray-300/20 p-1 text-center transition duration-300 ease-in-out hover:bg-gray-300/50 "
                    >
                      {user.name ?? ""}{" "}
                      <span className="font-semibold text-primary">
                        {user.email}
                      </span>
                    </li>
                  ))
                )}
              </ol>
            </div>
            <div className="border-blueGray-200 mt-10 border-t py-10 text-center">
              <div className="flex flex-wrap justify-center">
                <div className="w-full px-4 lg:w-9/12">
                  <p className="text-blueGray-700 mb-4 text-lg leading-relaxed">
                    To know about your current plans and offers please click
                  </p>
                  <Link
                    href={`/billing/manage/${profile.user?.id}`}
                    className="font-normal text-primary"
                  >
                    Manage
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Profile;
