"use client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { api } from "@/utils/api";
import { useRef, type FC } from "react";

const Page: FC = ({}) => {
  const email = useRef<HTMLTextAreaElement | null>(null);
  const { mutate: sendEmail, isLoading: sendEmailIsLoading } =
    api.profile.inviteUser.useMutation({
      onSuccess() {
        if (email.current?.value) email.current.value = "";

        toast({
          description:
            "User invited, user must login with the credentials shared on email",
        });
      },
      onError(err) {
        console.log("err", err);

        toast({
          variant: "destructive",
          description: "User already registered!, Please add manually",
        });
      },
    });

  const handleEmailSend = () => {
    if (email.current?.value) {
      email.current.value.split(",").map((email) => {
        console.log("email", email.trim());

        sendEmail({ email: email.trim() });
      });
    }
  };

  return (
    <div className="flex w-full justify-center">
      <div className="flex w-1/2 flex-col gap-2">
        <Textarea
          placeholder="Enter emails separated by comma (e.g. john@email.com, tessa@email.com)"
          ref={email}
        />
        <Button loading={sendEmailIsLoading} onClick={() => handleEmailSend()}>
          Invite
        </Button>
      </div>
    </div>
  );
};

export default Page;
