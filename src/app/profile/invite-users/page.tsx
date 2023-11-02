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
        sendEmail({ email: email.trim() });
      });
    }
  };

  return (
    <div className="flex h-[80vh] w-full items-center justify-center">
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
      <div className="flex w-1/2 flex-col gap-4">
        <Textarea
          placeholder="Enter emails separated by comma (e.g. john@email.com, tessa@email.com)"
          rows={10}
          className="p-6"
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
