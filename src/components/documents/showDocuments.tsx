import { api } from "@/utils/api";
import type { FC } from "react";
import Spinner from "../ui/spinner";

interface ShowDocumentsProps {
  t?: true;
}

const ShowDocuments: FC<ShowDocumentsProps> = ({ t }) => {
  const documents = api.documents.getMyDocuments.useQuery();
  if (documents.isLoading) return <Spinner />;

  if (!documents.data) return <>Empty</>;
  console.log("documents", documents);

  return (
    <>
      {documents.data.map((document) => {
        return document.name;
      })}
    </>
  );
};

export default ShowDocuments;
