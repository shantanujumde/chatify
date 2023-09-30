import ReadDocuments from "@/components/documents/readDocuments";
import ShowDocuments from "@/components/documents/showDocuments";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Spinner from "@/components/ui/spinner";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import type { FC } from "react";

const Documents: FC = ({}) => {
  const { status } = useSession();
  const router = useRouter();
  if (status === "loading") {
    return <Spinner />;
  }

  if (status === "unauthenticated") {
    void router.push("/auth/login");
  }

  return (
    <>
      <CardHeader>
        <CardTitle>Add documents</CardTitle>
        <CardDescription>Select the documents you want to add.</CardDescription>
      </CardHeader>
      <CardContent>
        <ReadDocuments />
      </CardContent>
      <CardHeader>
        <CardTitle>Your documents</CardTitle>
        <CardDescription>Edit, rename, delete documents here.</CardDescription>
      </CardHeader>
      <CardContent>
        <ShowDocuments />
      </CardContent>
    </>
  );
};

export default Documents;
