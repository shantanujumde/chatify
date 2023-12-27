import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useReadText } from "@/hooks/readTextFromDocument";
import { api } from "@/utils/api";
import React, { useEffect, useState, type FC } from "react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { toast } from "../ui/use-toast";

const ReadDocuments: FC<{ refetchDocuments: () => Promise<void> }> = ({
  refetchDocuments,
}) => {
  const [textObj, getTextFromDoc] = useReadText();
  const [textContent, setTextContent] = useState("");

  useEffect(() => {
    if (textObj.text) {
      setTextContent(textObj.text);
    }
  }, [textObj]);

  const {
    text,
    name,
    states: { loading: loadingDocument },
  } = textObj;

  const { mutate: createEmbedding, isLoading: isCreateEmbeddingLoading } =
    api.openAi.createEmbeddings.useMutation({
      onSuccess: async () => {
        await refetchDocuments();
        toast({
          description: "Document added successfully",
        });
      },
      onError: (error) => {
        toast({
          title: "Error creating embedding",
          description: error.message,
          variant: "destructive",
        });
      },
    });

  const handleCreateEmbedding = (text: string, name: string) => {
    if (!text || !name) return;

    createEmbedding({
      content: text,
      name: name,
      extension: name.split(".")[1] ?? "NOT_AVAILABLE",
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    getTextFromDoc(e);
    e.target.value = "";
  };
  const textArea = (
    <Textarea
      className="scrollbar-thumb-black scrollbar-track-black-lighter dark:scrollbar-thumb-white  
dark:scrollbar-track-white-lighter scrollbar-thumb-rounded 
scrollbar-w-2 scrolling-touch h-60 max-h-max resize-none overflow-auto"
      value={textContent}
      onChange={(e) => setTextContent(e.target.value)}
      placeholder="Type something here..."
      disabled={loadingDocument}
    />
  );
  return (
    <div className="relative flex h-full w-full flex-row justify-between gap-4 max-md:flex-col max-md:items-center">
      <div className="ml-4 flex w-1/2 max-w-sm flex-col items-center justify-center gap-6 max-md:w-full">
        <Label htmlFor="pdf" className="text-xl uppercase underline">
          Select pdf
        </Label>
        <Input id="pdf" type="file" accept=".pdf" onChange={handleFileChange} />

        <Button
          className="w-full"
          loading={loadingDocument || isCreateEmbeddingLoading}
          disabled={textContent.length === 0 || loadingDocument}
          onClick={() => handleCreateEmbedding(textContent, name)}
        >
          Save
        </Button>
      </div>

      <div
        className="scrollbar-thumb-black scrollbar-track-black-lighter  
          dark:scrollbar-thumb-white dark:scrollbar-track-white-lighter 
          scrollbar-thumb-rounded   scrollbar-w-2
         scrolling-touch flex h-80 max-h-screen w-1/2 flex-col gap-6 overflow-auto overflow-y-scroll rounded-xl bg-gray-300/20 p-6 py-2 pl-4 dark:bg-gray-300/5 max-md:w-full"
      >
        <h2 className="flex justify-center">
          <span className="text-xl uppercase underline">Content</span>
        </h2>
        {text ? (
          <>{textArea}</>
        ) : (
          <div className="flex w-full flex-col items-center gap-2 align-middle">
            {textArea}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReadDocuments;
