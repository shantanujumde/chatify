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
        <CardTitle className="text-center">Select documents</CardTitle>
        <CardDescription className="text-center">
          Select the documents you want to add to your knowledge base.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ReadDocuments />
        {/* alternate way to get documents with drag and drop method */}
        {/* <DragDocuments /> */}
      </CardContent>

      <CardHeader>
        <CardTitle className="mt-4 text-center">My documents</CardTitle>
        <CardDescription className="text-center">
          View, edit, rename or delete your knowledge base.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ShowDocuments />
      </CardContent>
    </>
  );
};

export default Documents;
