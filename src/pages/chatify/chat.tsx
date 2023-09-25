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
import Spinner from "@/components/ui/spinner";
import { api } from "@/utils/api";
import {
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
  PaperPlaneIcon,
} from "@radix-ui/react-icons";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRef, type FC } from "react";

const Chat: FC = ({}) => {
  const searchParams = useSearchParams();
  const currentPage = searchParams.get("page") ?? "1";

  const documents = api.documents.getMyDocuments.useQuery();

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
  } = api.chat.getChats.useQuery({ page: Number(currentPage) });

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
            {documents.data?.map((document, indx) => (
              <li key={document.id}>
                {indx + 1}. {document.textTitle}
              </li>
            ))}
            {documents.isLoading && <Spinner />}
            {documents.isError && <li>Error, Please contact admin!</li>}
            {documents.isSuccess && !documents.data?.length && (
              <li>Please add some documents</li>
            )}
          </ol>
        </CardContent>
        <CardFooter></CardFooter>
        <hr className="w-10/12" />
        <CardHeader>
          <CardTitle>History</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Card Content</p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Link
            href={`?page=${
              chats?.length ? Number(currentPage) + 1 : Number(currentPage)
            }`}
          >
            <Button>
              <DoubleArrowLeftIcon />
            </Button>
          </Link>
          <Link href={"?page=1"}>Page {currentPage}</Link>
          <Link
            href={`?page=${
              Number(currentPage) > 1
                ? Number(currentPage) - 1
                : Number(currentPage)
            }`}
          >
            <Button>
              <DoubleArrowRightIcon />
            </Button>
          </Link>
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
