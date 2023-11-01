import Spinner from "@/components/ui/spinner";
import { api } from "@/utils/api";
import { format } from "date-fns";
import { UserCircle2 } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

const Profile = ({}) => {
  const router = useRouter();

  const { data: sessionData, status } = useSession({
    required: true,
    async onUnauthenticated() {
      await router.push("/auth/login");
    },
  });

  const { id } = router.query;
  const { isLoading: userIsLoading, data: user } =
    api.profile.getUserProfile.useQuery(
      { id: String(id) },
      { enabled: sessionData?.user !== undefined }
    );

  const { data: documents, isLoading: documentsIsLoading } =
    api.documents.getMyDocuments.useQuery({
      page: 1,
    });

  const { data: chats, isLoading: chatsIsLoading } = api.chat.getChats.useQuery(
    { page: 1 }
  );
  console.log("", user?.createdAt);

  if (
    status === "loading" ||
    userIsLoading ||
    documentsIsLoading ||
    chatsIsLoading
  )
    return <Spinner />;

  return (
    <>
      <section className="pt-16 ">
        <div className=" mx-auto w-full px-4 lg:w-1/2">
          <div className="relative mb-6  mt-16 flex w-full min-w-0 flex-col break-words rounded-lg bg-white shadow-xl dark:border dark:border-gray-400 dark:bg-transparent dark:shadow-white">
            <div className="px-6">
              <div className="flex flex-wrap justify-center">
                <div className="flex w-full justify-center px-4">
                  <div className="relative">
                    {sessionData.user?.image ? (
                      <Image
                        alt="profile pic"
                        src={sessionData.user.image}
                        width={300}
                        height={300}
                        className="-mt-20  max-h-[300px] rounded-full border-none bg-white object-none text-center align-middle shadow-xl dark:bg-gray-800"
                      />
                    ) : (
                      <UserCircle2 className="-mt-20 h-40 w-40 rounded-full border-none bg-white text-center align-middle shadow-xl dark:bg-gray-800" />
                    )}
                  </div>
                </div>
                <div className="mt-20 w-full px-4 text-center">
                  <div className="flex justify-center py-4 pt-8 lg:pt-4">
                    <div className="mr-4 p-3 text-center">
                      <span className="block text-xl font-bold uppercase tracking-wide text-primary">
                        {documents?.totalFiles}
                      </span>
                      <span className="text-sm text-primary/40">Files</span>
                    </div>
                    <div className="mr-4 p-3 text-center">
                      <span className="block text-xl font-bold uppercase tracking-wide text-primary">
                        ≤ {(chats?.chatLength ?? 0) * 10}
                      </span>
                      <span className="text-sm text-primary/40">Chats</span>
                    </div>
                    <div className="p-3 text-center lg:mr-4">
                      <span className="block text-xl font-bold uppercase tracking-wide text-primary">
                        {user?.createdAt
                          ? format(user.createdAt, "dd MMM yy")
                          : null}
                      </span>
                      <span className="text-sm text-primary/40">Joined On</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-12 text-center">
                <h3 className="text-blueGray-700 mb-2  text-xl font-semibold leading-normal">
                  {user?.name?.toLocaleUpperCase()}
                </h3>
                <div className="text-blueGray-400 mb-2 mt-0 text-sm font-bold leading-normal">
                  <i className="fas fa-map-marker-alt text-blueGray-400 mr-2 text-lg"></i>
                  {user?.email?.toLocaleLowerCase()}
                </div>
                <div className="text-blueGray-600 mb-2 mt-10">
                  <i className="fas fa-briefcase text-blueGray-400 mr-2 text-lg"></i>
                  Knowledge base of{" "}
                  <span className="font-semibold text-primary">
                    {documents?.totalFiles}
                  </span>{" "}
                  files
                </div>
                <div className="text-blueGray-600 mb-2">
                  <i className="fas fa-university text-blueGray-400 mr-2 text-lg"></i>
                  {/* {user?.company} */}
                </div>
              </div>
              <div className="border-blueGray-200 mt-10 border-t py-10 text-center">
                <div className="flex flex-wrap justify-center">
                  <div className="w-full px-4 lg:w-9/12">
                    <p className="text-blueGray-700 mb-4 text-lg leading-relaxed">
                      To know about your current plans and offers please click
                    </p>
                    <Link
                      href={`billing/manage/${user?.id}`}
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
        <footer className="relative  mt-8 pb-6 pt-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap items-center justify-center md:justify-between">
              <div className="mx-auto w-full px-4 text-center md:w-6/12">
                {/* <div className="text-blueGray-500 py-1 text-sm font-semibold">
                  Made with{" "}
                  <a
                    href="https://www.creative-tim.com/product/notus-js"
                    className="text-blueGray-500 hover:text-gray-800"
                    target="_blank"
                  >
                    Notus JS
                  </a>{" "}
                  by{" "}
                  <a
                    href="https://www.creative-tim.com"
                    className="text-blueGray-500 hover:text-blueGray-800"
                    target="_blank"
                  >
                    {" "}
                    Creative Tim
                  </a>
                  .
                </div> */}
              </div>
            </div>
          </div>
        </footer>
      </section>
    </>
  );
};

export default Profile;
