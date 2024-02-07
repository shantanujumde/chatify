import { type AppRouter } from "@/server/api/root";
import { api } from "@/utils/api";
import {
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
  InfoCircledIcon,
} from "@radix-ui/react-icons";
import { type TRPCClientErrorLike } from "@trpc/client";
import { type UseTRPCQueryResult } from "@trpc/react-query/shared";
import { FileSignature, Save, Trash2 } from "lucide-react";
import {
  useRef,
  useState,
  type Dispatch,
  type FC,
  type SetStateAction,
} from "react";
import Skeleton from "react-loading-skeleton";
import EmptyItems from "../emptyItems";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import Spinner from "../ui/spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

type ShowDocumentsProps = {
  getDocuments: UseTRPCQueryResult<
    {
      pageLength: number;
      totalFiles: number;
      documents: ({
        _count: {
          embedding: number;
          organization: number;
        };
      } & {
        id: number;
        content: string;
        name: string;
        extension: string;
        deleted: boolean;
        createdAt: Date | null;
        updatedAt: Date | null;
        organizationId: string | null;
      })[];
    },
    TRPCClientErrorLike<AppRouter["documents"]["getMyDocuments"]>
  >;
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
};

const ShowDocuments: FC<ShowDocumentsProps> = ({
  getDocuments,
  page,
  setPage,
}) => {
  const [edit, setEdit] = useState<number | null>();
  const [loadingDocumentId, setLoadingDocumentId] = useState<number | null>(
    null
  );
  const editRef = useRef<HTMLInputElement>(null);

  const renameDocument = api.documents.renameDocumentById.useMutation({
    onSuccess: async () => {
      await getDocuments.refetch();
    },
    onMutate: ({ id }) => setLoadingDocumentId(id),
    onSettled: () => setLoadingDocumentId(null),
  });

  const deleteDocument = api.documents.deleteDocumentsById.useMutation({
    onSuccess: async () => {
      await getDocuments.refetch();
    },
    onMutate: (ids) => setLoadingDocumentId(ids[0]!),
    onSettled: () => setLoadingDocumentId(null),
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

  if (getDocuments.isLoading)
    return (
      <Skeleton
        count={10}
        baseColor="#7a7a7a"
        highlightColor="#fff"
        height="2rem"
        borderRadius="1rem"
        className="mb-4"
      />
    );

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
              className="border-none"
            >
              <div className="flex">
                {loadingDocumentId === document.id ? (
                  <div>
                    <Spinner className="m-auto bg-secondary px-3 py-1 text-xl font-semibold text-red-400" />
                  </div>
                ) : (
                  <p className="m-auto rounded-sm bg-primary px-3 py-1 text-xl font-semibold text-white dark:text-black">
                    {indx + 1}
                  </p>
                )}
                <div className="w-1/2 text-center">
                  <AccordionTrigger
                    showChevronDown={false}
                    className="w-full hover:no-underline"
                  >
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
                        <div className="flex justify-center gap-1">
                          <p className="cursor-pointer truncate rounded-2xl bg-gray-300/20 px-4 py-2 text-center transition duration-300 ease-in-out hover:bg-gray-300/50 ">
                            {document.name}{" "}
                            {document.extension
                              ? `(${document.extension})`
                              : ""}
                          </p>
                        </div>
                      )}
                    </div>
                  </AccordionTrigger>
                </div>
                <div className="m-auto flex w-1/2 justify-end gap-4">
                  {document._count.embedding <= 0 && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <InfoCircledIcon className="h-6 w-6 cursor-pointer text-red-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          There was some problem indexing this document please
                          try reuploading it. Please delete this document after
                          a successful reupload.
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                  {edit === document.id ? (
                    <Save
                      className="cursor-pointer text-green-400"
                      onClick={() =>
                        void handleRename(document.id, editRef.current?.value)
                      }
                    />
                  ) : (
                    <FileSignature
                      className="cursor-pointer text-primary"
                      onClick={() => setEdit(document.id)}
                    />
                  )}

                  <Trash2
                    className="cursor-pointer text-red-400"
                    onClick={() => void handleDeleteDocument([document.id])}
                  />
                </div>
              </div>
              <AccordionContent className="mx-4 rounded-xl bg-gray-300/20 px-4 dark:bg-gray-300/5">
                <br />
                {document.content}
              </AccordionContent>
            </AccordionItem>
          ) : null;
        })}
      </Accordion>
      <div className="mt-4  flex w-full justify-between rounded-xl border border-gray-500/50 p-1">
        <Button
          onClick={() => page !== 1 && setPage((currPage) => currPage - 1)}
          className="w-fit"
          variant="ghost"
          type="button"
          disabled={page === 1}
        >
          <DoubleArrowLeftIcon />
        </Button>
        <Button onClick={() => setPage(1)} variant="ghost" className="m-auto">
          Page
          <span className="text-sm font-semibold text-primary">
            &nbsp;{page}
          </span>
          /{getDocuments.data?.pageLength}
        </Button>
        <Button
          className="w-fit"
          type="button"
          variant="ghost"
          onClick={() =>
            page !== getDocuments.data.pageLength &&
            setPage((currPage) => currPage + 1)
          }
          disabled={page === getDocuments.data.pageLength}
        >
          <DoubleArrowRightIcon />
        </Button>
      </div>
    </>
  );
};

export default ShowDocuments;
