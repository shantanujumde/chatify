import ReadDocuments from "@/components/documents/readDocuments";
import ShowDocuments from "@/components/documents/showDocuments";
import {
  Card,
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
    <Card className="p-4">
      <CardHeader>
        <CardTitle>Select documents</CardTitle>
        <CardDescription>Select the documents you want to add.</CardDescription>
      </CardHeader>
      <CardContent>
        <ReadDocuments />
      </CardContent>
      <CardHeader>
        <CardTitle>My documents</CardTitle>
        <CardDescription>
          Edit, rename or delete your documents.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ShowDocuments />
      </CardContent>
    </Card>
  );
};

export default Documents;
