import { api } from "@/utils/api";
import { CheckIcon, Pencil2Icon, TrashIcon } from "@radix-ui/react-icons";
import { useRef, useState, type FC } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Input } from "../ui/input";
import Spinner from "../ui/spinner";

const ShowDocuments: FC = () => {
  const [edit, setEdit] = useState<number | null>();
  const editRef = useRef<HTMLInputElement>(null);

  const getDocuments = api.documents.getMyDocuments.useQuery();
  const renameDocument = api.documents.renameDocumentById.useMutation({
    onSuccess: async () => {
      await getDocuments.refetch();
    },
  });
  const deleteDocument = api.documents.deleteDocumentsById.useMutation({
    onSuccess: async () => {
      await getDocuments.refetch();
    },
  });

  const handleDeleteDocument = async (ids: Array<number>) => {
    await deleteDocument.mutateAsync(ids);
  };

  const handleRename = (
    documentId: number,
    documentNewName: string | undefined
  ) => {
    setEdit(null);
    if (!documentNewName) return;
    renameDocument.mutate({ id: documentId, name: documentNewName });
  };
  if (getDocuments.isLoading) return <Spinner />;

  if (!getDocuments.data) return <>Empty</>;
  console.log("documents", getDocuments);

  return (
    <Accordion type="single" collapsible className="w-full">
      {getDocuments.data.map((document, indx) => {
        return !document.deleted ? (
          <AccordionItem key={document.id} value={document.id.toString()}>
            <div className="m-auto flex">
              <div className="w-1/2">
                <AccordionTrigger className="flex justify-between">
                  <p>{indx + 1}.</p>
                  {edit === document.id ? (
                    <Input defaultValue={document.name} ref={editRef} />
                  ) : (
                    <p>{document.name}</p>
                  )}
                </AccordionTrigger>
              </div>
              <div className="m-auto flex w-1/2 justify-end">
                {edit === document.id ? (
                  <CheckIcon
                    onClick={() =>
                      void handleRename(document.id, editRef.current?.value)
                    }
                  />
                ) : (
                  <Pencil2Icon onClick={() => setEdit(document.id)} />
                )}
                <TrashIcon
                  onClick={() => void handleDeleteDocument([document.id])}
                />
              </div>
            </div>
            <AccordionContent>{document.content}</AccordionContent>
          </AccordionItem>
        ) : null;
      })}
    </Accordion>
  );
};

export default ShowDocuments;
