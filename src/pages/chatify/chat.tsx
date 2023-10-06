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
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRef, type FC } from "react";
import Skeleton from "react-loading-skeleton";

const Chat: FC = ({}) => {
  const searchParams = useSearchParams();
  const currentChat = searchParams.get("page") ?? "1";
  const currentFile = searchParams.get("file") ?? "1";

  console.log("curr", currentChat, currentFile);

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
    <div className="flex max-h-screen gap-4">
      <Card className="flex w-1/5 flex-col">
        <CardHeader>
          <CardTitle>Your PDF&apos;s</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>
          <ol>
            {getDocuments.isLoading ? (
              <Skeleton count={10} baseColor="#7a7a7a" highlightColor="#fff" />
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
            <Link href={`?page=${currentChat}&file=${Number(currentFile) - 1}`}>
              <DoubleArrowLeftIcon />
            </Link>
          </Button>
          <Link href={"&file=1"}>
            file {currentFile}/ {getDocuments.data?.pageLength}
          </Link>
          <Button
            disabled={Number(currentFile) === getDocuments.data?.pageLength}
          >
            <Link href={`?page=${currentChat}&file=${Number(currentFile) + 1}`}>
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
        <CardFooter className="flex justify-between">
          <Button disabled={Number(currentChat) === 1}>
            <Link
              href={`?page=${
                Number(currentChat) > 1
                  ? Number(currentChat) - 1
                  : Number(currentChat)
              }&file=${currentFile}`}
            >
              <DoubleArrowLeftIcon />
            </Link>
          </Button>

          <Link href={"?page=1"}>Page {currentChat}</Link>
          <Button disabled={Number(currentChat) === chats?.length}>
            <Link
              href={`?page=${
                chats?.length ? Number(currentChat) + 1 : Number(currentChat)
              }&file=${currentFile}`}
            >
              <DoubleArrowRightIcon />
            </Link>
          </Button>
        </CardFooter>
      </Card>

      <Card className="flex w-4/5 flex-col">
        <CardHeader>
          <CardTitle>Chat</CardTitle>
          <CardDescription>
            Type descriptive messages to get results
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-y-scroll">
          <ChatMessages
            chats={chats!}
            isScreenLoading={chatsIsLoading}
            isChatLoading={createChat.isLoading}
          />
        </CardContent>
        <CardFooter className="m-2">
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
        </CardFooter>
      </Card>
    </div>
  );
};

export default Chat;
