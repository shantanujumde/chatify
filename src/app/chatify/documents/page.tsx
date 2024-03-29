"use client";
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
import { api } from "@/utils/api";
import { useSession } from "next-auth/react";
import { useState, type FC } from "react";

const Documents: FC = ({}) => {
  const [page, setPage] = useState(1);
  const getDocuments = api.documents.getMyDocuments.useQuery({ page });

  const { status } = useSession({
    required: true,
  });

  if (status === "loading") {
    return <Spinner />;
  }
  return (
    <Card>
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
      <CardHeader>
        <CardTitle className="text-center">Select documents</CardTitle>
        <CardDescription className="text-center">
          Select the documents you want to add to your knowledge base.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
        {/* @ts-ignore */}
        <ReadDocuments refetchDocuments={getDocuments.refetch} />
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
        <ShowDocuments
          getDocuments={getDocuments}
          setPage={setPage}
          page={page}
        />
      </CardContent>
    </Card>
  );
};

export default Documents;
