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
import { PaperPlaneIcon } from "@radix-ui/react-icons";
import type { FC } from "react";

const Chat: FC = ({}) => {
  const documents = api.documents.getMyDocuments.useQuery();

  return (
    <div className="flex max-h-screen  w-full gap-4">
      <Card className="flex w-auto flex-col gap-4">
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
        <hr className="m-auto w-10/12" />
        <CardHeader>
          <CardTitle>History</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Card Content</p>
        </CardContent>
        <CardFooter>
          <hr />
        </CardFooter>
      </Card>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Chat</CardTitle>
          <CardDescription>
            Type descriptive messages to get results
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[70vh] overflow-y-scroll">
          <ChatMessages />
        </CardContent>
        <CardFooter className="m-2">
          <form className="flex w-full gap-1">
            <Input />
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
