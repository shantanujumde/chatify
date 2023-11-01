"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { api } from "@/utils/api";
import { useRef, type FC } from "react";

const Page: FC = ({}) => {
  const email = useRef<HTMLInputElement | null>(null);
  const { mutate: sendEmail, isLoading: sendEmailIsLoading } =
    api.profile.sendEmail.useMutation({
      onSuccess() {
        if (email.current?.value) email.current.value = "";
      },
      onError(err) {
        console.log("err", err);

        toast({
          variant: "destructive",
          description: "Something went wrong!, please try again",
        });
      },
    });

  const handleEmailSend = () => {
    if (email.current?.value) sendEmail({ email: email.current.value });
  };

  return (
    <div className="flex w-full justify-center">
      <div className=" flex w-1/2 gap-2">
        <Input ref={email} />
        <Button loading={sendEmailIsLoading} onClick={() => handleEmailSend()}>
          Invite
        </Button>
      </div>
    </div>
  );
};

export default Page;
