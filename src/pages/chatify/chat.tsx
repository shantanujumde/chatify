import ChatMessages from "@/components/chatMessages";
import EmptyItems from "@/components/emptyItems";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Spinner from "@/components/ui/spinner";
import { toast } from "@/components/ui/use-toast";
import { api } from "@/utils/api";
import {
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
  PaperPlaneIcon,
} from "@radix-ui/react-icons";
import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRef, type FC } from "react";
import Skeleton from "react-loading-skeleton";

const Chat: FC = ({}) => {
  const searchParams = useSearchParams();
  const currentChat = searchParams?.get("page") ?? "1";
  const currentFile = searchParams?.get("file") ?? "1";

  const { data: userData } = useSession({
    required: true,
  });

  const utils = api.useContext();

  const getDocuments = api.documents.getMyDocuments.useQuery({
    page: Number(currentFile),
  });

  const { data: chats, isLoading: chatsIsLoading } = api.chat.getChats.useQuery(
    { page: Number(currentChat) }
  );

  const createChat = api.chat.createChat.useMutation({
    onMutate: async ({ question, response }) => {
      await utils.chat.getChats.cancel();

      if (chats && userData) {
        utils.chat.getChats.setData(
          { page: Number(currentChat) },
          {
            chatLength: (chats.chatLength ?? 0) + 1,
            chats: [
              ...(chats.chats ?? []),
              {
                id: (chats.chats?.length ?? 0) + 1,
                question,
                response,
                createdAt: new Date(),
                userId: userData.user?.id ?? "",
              },
            ],
          }
        );
      }

      return chats;
    },
    onError: (__, _, context) => {
      utils.chat.getChats.setData({ page: Number(currentChat) }, context);
    },
    onSettled: async () => {
      if (questionRef?.current) questionRef.current.value = "";
      const chatWindow = document.getElementById("chatWindow");
      if (chatWindow)
        chatWindow.scrollTo({
          top: chatWindow.scrollHeight,
          behavior: "smooth",
        });
      await utils.chat.getChats.invalidate();
    },
  });

  const questionRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const message = questionRef.current?.value;
    console.log("message", message);

    if (message) {
      const data = sendMessage({ message });
      console.log("data", data);
    }
  };
  console.log("chats", chats);

  const { mutate: sendMessage } = useMutation({
    mutationFn: async ({ message }: { message: string }) => {
      const response = await fetch("/api/message", {
        method: "POST",
        body: JSON.stringify({
          message,
        }),
      });

      return response.body;
    },
    onMutate: async ({ message }) => {
      if (questionRef?.current) questionRef.current.value = "";
      const chatWindow = document.getElementById("chatWindow");
      if (chatWindow)
        chatWindow.scrollTo({
          top: chatWindow.scrollHeight,
          behavior: "smooth",
        });
      await utils.chat.getChats.cancel();

      if (chats && userData) {
        utils.chat.getChats.setData(
          { page: Number(currentChat) },
          {
            chatLength: (chats.chatLength ?? 0) + 1,
            chats: [
              ...(chats.chats ?? []),
              {
                id: (chats.chats?.length ?? 0) + 1,
                question: message,
                response: "",
                createdAt: new Date(),
                userId: userData.user?.id ?? "",
              },
            ],
          }
        );
      }

      return chats;
    },
    async onSuccess(stream, { message }) {
      if (!stream) {
        return toast({
          title: "There was a problem sending this message",
          description: "Please refresh this page and try again",
          variant: "destructive",
        });
      }

      const reader = stream.getReader();
      const decoder = new TextDecoder();
      let done = false;

      // accumulated response
      let accResponse = "";
      let i = 0;
      while (!done) {
        console.log("i++", i++);

        const { value, done: doneReading } = await reader.read();

        console.log("🚀 ~ file: chat.tsx:153 ~ onSuccess ~ value:", value);
        done = doneReading;
        const chunkValue = decoder.decode(value);
        console.log(
          "🚀 ~ file: chat.tsx:157 ~ onSuccess ~ chunkValue:",
          chunkValue
        );

        accResponse += chunkValue;
        console.log("acc", accResponse, chunkValue);

        // append chunk to the actual message

        if (chats && userData) {
          utils.chat.getChats.setData(
            { page: Number(currentChat) },
            {
              chatLength: (chats.chatLength ?? 0) + 1,
              chats: [
                ...(chats.chats ?? []),
                {
                  id: (chats.chats?.length ?? 0) + 1,
                  question: message,
                  response: accResponse,
                  createdAt: new Date(),
                  userId: userData.user?.id ?? "",
                },
              ],
            }
          );
        }

        console.log("🚀 ~ file: chat.tsx:191 ~ onSuccess ~ chats:", chats);
      }
      return chats;
    },
    onError: () => {
      toast({
        description: "Error while sending message",
      });
    },
    onSettled: async () => {
      await utils.chat.getChats.invalidate();
    },
  });

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
      <Card className="flex flex-row gap-4 max-md:flex-col-reverse">
        <div className="flex w-1/5 flex-col max-md:w-full">
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
                  height="2rem"
                  borderRadius="1rem"
                />
              ) : !getDocuments.data?.pageLength ? (
                <EmptyItems />
              ) : (
                getDocuments.data.documents.map((document) => (
                  <li
                    key={document.id}
                    className="mt-1 cursor-pointer truncate rounded-2xl bg-gray-300/20 p-1 text-center transition duration-300 ease-in-out hover:bg-gray-300/50 "
                  >
                    {document.name}
                  </li>
                ))
              )}

              {getDocuments.isError && <li>Error, Please contact admin!</li>}
              {getDocuments.isSuccess && !getDocuments.data.pageLength && (
                <li>Please add some documents</li>
              )}
            </ol>
          </CardContent>
          <CardFooter className="flex justify-between ">
            <div className="flex w-full justify-between rounded-xl border border-gray-500/50 p-1 ">
              <Link
                className="px-2 py-4"
                href={`?page=${currentChat}&file=${
                  Number(currentFile) === 1 ? 1 : Number(currentFile) - 1
                }`}
              >
                <DoubleArrowLeftIcon />
              </Link>
              <Link
                href={`?page=${currentChat}&file=1`}
                className="flex flex-col items-center"
              >
                File
                <span className="flex items-center">
                  <span className="text-sm font-semibold text-primary">
                    {currentFile}
                  </span>
                  /{" "}
                  <span>
                    {getDocuments.data?.pageLength ? (
                      getDocuments.data.pageLength
                    ) : getDocuments.isLoading ? (
                      <Spinner className="h-3 w-3" />
                    ) : (
                      1
                    )}
                  </span>
                </span>
              </Link>

              <Link
                className="px-2 py-4"
                href={`?page=${currentChat}&file=${
                  getDocuments.data?.pageLength &&
                  getDocuments.data?.pageLength <= Number(currentFile)
                    ? Number(currentFile) + 1
                    : 1
                }`}
              >
                <DoubleArrowRightIcon />
              </Link>
            </div>
          </CardFooter>
        </div>
        <div className="flex w-4/5 flex-col max-md:w-full">
          <CardHeader>
            <CardTitle>Chat</CardTitle>
            <CardDescription>
              Type descriptive messages to get results
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChatMessages
              chats={chats?.chats}
              isScreenLoading={chatsIsLoading}
              isChatLoading={createChat.isLoading}
              user={userData?.user}
            />
          </CardContent>
          <CardFooter className="m-2 flex flex-col">
            <form className="flex w-full" onSubmit={handleSubmit}>
              <Input
                ref={questionRef}
                type="text"
                name="text"
                placeholder="Type here..."
              />
              <Button type="submit" className="ml-4">
                <PaperPlaneIcon />
              </Button>
            </form>
            {chats?.chatLength ? (
              <div className="mt-4 flex w-full justify-between rounded-xl border border-gray-500/50">
                <Link
                  className={buttonVariants({
                    variant: "ghost",
                    size: "icon",
                    className:
                      Number(currentChat) === chats.chatLength
                        ? " pointer-events-none"
                        : "",
                  })}
                  href={`?page=${
                    Number(currentChat) < chats.chatLength
                      ? Number(currentChat) + 1
                      : Number(currentChat)
                  }&file=${currentFile}`}
                >
                  <DoubleArrowLeftIcon />
                </Link>
                <Link
                  className={buttonVariants({
                    variant: "ghost",
                  })}
                  href={`?page=1&file=${currentFile}`}
                >
                  Chat
                  <span className="text-sm font-semibold text-primary">
                    &nbsp;
                    {currentChat}
                  </span>
                  / {chats?.chatLength}
                </Link>
                <Link
                  className={buttonVariants({
                    variant: "ghost",
                    size: "icon",
                    className:
                      Number(currentChat) === 1 ? " pointer-events-none" : "",
                  })}
                  href={`?page=${
                    Number(currentChat) > 1
                      ? Number(currentChat) - 1
                      : Number(currentChat)
                  }&file=${currentFile}`}
                >
                  <DoubleArrowRightIcon />
                </Link>
              </div>
            ) : null}
          </CardFooter>
        </div>
      </Card>
    </>
  );
};

export default Chat;
