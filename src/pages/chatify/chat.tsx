import ChatMessages from "@/components/chatMessages";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { api } from "@/utils/api";
import {
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
  PaperPlaneIcon,
} from "@radix-ui/react-icons";
import { GhostIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRef, type FC } from "react";
import Skeleton from "react-loading-skeleton";

const Chat: FC = ({}) => {
  const searchParams = useSearchParams();
  const currentChat = searchParams.get("page") ?? "1";
  const currentFile = searchParams.get("file") ?? "1";
  const { data: userData } = useSession();
  const getDocuments = api.documents.getMyDocuments.useQuery({
    page: Number(currentFile),
  });

  const createChat = api.chat.createChat.useMutation({
    onSuccess: async () => {
      await refetchChats();
      if (questionRef.current) questionRef.current.value = "";
    },
  });

  const {
    data: chats,
    isLoading: chatsIsLoading,
    refetch: refetchChats,
  } = api.chat.getChats.useQuery({ page: Number(currentChat) });

  const questionRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const question = questionRef.current?.value;
    if (question) {
      createChat.mutate({
        question,
        response: (Math.random() * 100).toString(),
      });
    }
  };

  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none fixed  inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
      >
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
        />
      </div>
      <div className="flex flex-row gap-4 max-sm:flex-col-reverse">
        <Card className="min-md:max-w-fit flex flex-col max-sm:w-full">
          <CardHeader>
            <CardTitle>Knowledge base</CardTitle>
            <CardDescription>
              All your files available to explore via chats.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ol>
              {getDocuments.isLoading ? (
                <Skeleton
                  count={10}
                  baseColor="#7a7a7a"
                  highlightColor="#fff"
                />
              ) : !getDocuments.data?.pageLength ? (
                <div className="flex w-full flex-col items-center gap-2 ">
                  <GhostIcon className="h-8 w-8" />
                  <p className="text-xl font-semibold">I am lonely here!</p>
                  <p className="">Let&apos;s create history together</p>
                </div>
              ) : (
                getDocuments.data.documents.map((document, indx) => (
                  <li key={document.id}>
                    {indx + 1}. {document.name}
                  </li>
                ))
              )}

              {getDocuments.isError && <li>Error, Please contact admin!</li>}
              {getDocuments.isSuccess && !getDocuments.data.pageLength && (
                <li>Please add some documents</li>
              )}
            </ol>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button disabled={Number(currentFile) === 1}>
              <Link
                href={`?page=${currentChat}&file=${Number(currentFile) - 1}`}
              >
                <DoubleArrowLeftIcon />
              </Link>
            </Button>
            <Button variant="ghost" className="m-auto">
              <Link href={`?page=${currentChat}&file=1`}>
                file {currentFile}/ {getDocuments.data?.pageLength}
              </Link>
            </Button>

            <Button
              disabled={Number(currentFile) === getDocuments.data?.pageLength}
            >
              <Link
                href={`?page=${currentChat}&file=${Number(currentFile) + 1}`}
              >
                <DoubleArrowRightIcon />
              </Link>
            </Button>
          </CardFooter>
          <hr className="w-10/12" />
          <CardHeader>
            <CardTitle>History</CardTitle>
            <CardDescription>Card Description</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Card Content</p>
          </CardContent>
          <CardFooter className="flex justify-between"></CardFooter>
        </Card>

        <Card className="flex w-4/5 flex-col max-sm:w-full">
          <CardHeader>
            <CardTitle>Chat</CardTitle>
            <CardDescription>
              Type descriptive messages to get results
            </CardDescription>
          </CardHeader>
          <CardContent className="">
            <ChatMessages
              chats={chats!}
              isScreenLoading={chatsIsLoading}
              isChatLoading={createChat.isLoading}
              user={userData?.user}
            />
          </CardContent>
          <CardFooter className="m-2 flex flex-col">
            <form className="flex w-full gap-1" onSubmit={handleSubmit}>
              <Input
                ref={questionRef}
                type="text"
                name="text"
                placeholder="Type here..."
              />
              <Button>
                <PaperPlaneIcon />
              </Button>
            </form>
            <div className="mt-4 flex w-full rounded-xl border border-gray-500/50">
              <Button
                variant="ghost"
                disabled={Number(currentChat) === chats?.length}
              >
                <Link
                  href={`?page=${
                    chats?.length
                      ? Number(currentChat) + 1
                      : Number(currentChat)
                  }&file=${currentFile}`}
                >
                  <DoubleArrowLeftIcon />
                </Link>
              </Button>
              <Button variant="ghost" className="m-auto">
                <Link href={"?page=1&file=${currentFile}"}>
                  Page {currentChat}
                </Link>
              </Button>
              <Button variant="ghost" disabled={Number(currentChat) === 1}>
                <Link
                  href={`?page=${
                    Number(currentChat) > 1
                      ? Number(currentChat) - 1
                      : Number(currentChat)
                  }&file=${currentFile}`}
                >
                  <DoubleArrowRightIcon />
                </Link>
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </>
  );
};

export default Chat;
