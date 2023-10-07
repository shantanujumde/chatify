import { api } from "@/utils/api";
import {
  ArrowLeft,
  ArrowRight,
  FileSignature,
  Save,
  Trash2,
} from "lucide-react";
import { useRef, useState, type FC } from "react";
import EmptyItems from "../emptyItems";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Button } from "../ui/button";
import CustomSkeleton from "../ui/customSkeleton";
import { Input } from "../ui/input";

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

  if (getDocuments.isLoading) return <CustomSkeleton lines={3} />;

  if (getDocuments.isError)
    return <p>Something went wrong please contact admin!</p>;

  if (!getDocuments.data?.pageLength) return <EmptyItems />;

  return (
    <>
      <Accordion type="single" collapsible className="w-full">
        {getDocuments.data.documents?.map((document, indx) => {
          return !document.deleted ? (
            <AccordionItem
              key={document.id}
              value={document.id.toString()}
              className="border-yellow-700/40"
            >
              <div className="flex">
                <p className="m-auto rounded-sm  bg-yellow-400 p-2 text-xl font-semibold text-white dark:text-black">
                  {indx + 1}
                </p>
                <div className="w-1/2 text-center">
                  <AccordionTrigger showChevronDown={false} className="w-full">
                    <div className="w-full">
                      {edit === document.id ? (
                        <div className="flex  justify-center ">
                          <Input
                            defaultValue={document.name}
                            ref={editRef}
                            className="w-fit text-center"
                          />
                        </div>
                      ) : (
                        <p className="text-center font-semibold">
                          {document.name}
                        </p>
                      )}
                    </div>
                  </AccordionTrigger>
                </div>
                <div className="m-auto flex w-1/2 justify-end gap-4">
                  {edit === document.id ? (
                    <Save
                      className="cursor-pointer  text-green-400"
                      onClick={() =>
                        void handleRename(document.id, editRef.current?.value)
                      }
                    />
                  ) : (
                    <FileSignature
                      className="cursor-pointer text-yellow-400"
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
        <Button
          onClick={() => setPage((currPage) => currPage - 1)}
          className="w-fit"
          type="button"
          disabled={page === 1}
        >
          <ArrowLeft />
        </Button>
        <Button onClick={() => setPage(1)} variant="ghost" className="m-auto">
          Page {page}/{getDocuments.data?.pageLength}
        </Button>
        <Button
          className="w-fit"
          type="button"
          onClick={() => setPage((currPage) => currPage + 1)}
          disabled={page === getDocuments.data.documents.length}
        >
          <ArrowRight />
        </Button>
      </div>
    </>
  );
};

export default ShowDocuments;
