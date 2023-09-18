import Spinner from "@/components/ui/spinner";
import { api } from "@/utils/api";
import type { FC } from "react";

const Chat: FC = ({}) => {
  const documents = api.documents.getMyDocuments.useQuery();

  return (
    <div className="">
      <h1>Your PDF&apos;s</h1>
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

      <hr />
    </div>
  );
};

export default Chat;
