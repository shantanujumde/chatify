import { api } from "@/utils/api";
import {
  ArrowLeft,
  ArrowRight,
  FileSignature,
  Save,
  Trash2,
} from "lucide-react";
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
  const [page, setPage] = useState(1);

  const getDocuments = api.documents.getMyDocuments.useQuery({ page });
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

  return (
    <>
      <Accordion type="single" collapsible className="w-full">
        {getDocuments.data.map((document, indx) => {
          return !document.deleted ? (
            <AccordionItem key={document.id} value={document.id.toString()}>
              <div className="m-auto flex">
                <div className="w-1/2">
                  <AccordionTrigger className="flex justify-between">
                    <p>{indx + 1}.</p>
                    {edit === document.id ? (
                      <Input
                        defaultValue={document.name}
                        ref={editRef}
                        className="w-fit"
                      />
                    ) : (
                      <p>{document.name}</p>
                    )}
                  </AccordionTrigger>
                </div>
                <div className="m-auto flex w-1/2 justify-around">
                  {edit === document.id ? (
                    <Save
                      className="cursor-pointer text-green-400"
                      onClick={() =>
                        void handleRename(document.id, editRef.current?.value)
                      }
                    />
                  ) : (
                    <FileSignature
                      className="cursor-pointer text-blue-400"
                      onClick={() => setEdit(document.id)}
                    />
                  )}

                  <Trash2
                    className="cursor-pointer text-red-400"
                    onClick={() => void handleDeleteDocument([document.id])}
                  />
                </div>
              </div>
              <AccordionContent>{document.content}</AccordionContent>
            </AccordionItem>
          ) : null;
        })}
      </Accordion>
      <div className="mt-4 flex justify-around">
        <ArrowLeft
          onClick={() =>
            setPage((currPage) => (currPage > 0 ? currPage - 1 : 0))
          }
        />
        Page {page}
        <ArrowRight onClick={() => setPage((currPage) => currPage + 1)} />
      </div>
    </>
  );
};

export default ShowDocuments;
