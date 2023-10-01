import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useReadText } from "@/hooks/readTextFromDocument";
import { api } from "@/utils/api";
import { File } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";

const ReadDocuments: React.FC = () => {
  const [textObj, getTextFromDoc] = useReadText();
  const {
    text,
    name,
    states: { loading: loadingDocument },
  } = textObj;

  const {
    mutate: createEmbedding,
    isLoading: isCreateEmbeddingLoading,
    isError: isCreateEmbeddingError,
  } = api.openAi.createEmbeddings.useMutation({
    onSuccess: (data) => {
      return data;
    },
    onError: (error) => {
      return error;
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
  };

  return (
    <div className="relative flex h-full w-full justify-between">
      <div className="flex w-1/2 max-w-sm flex-col gap-6">
        <Label htmlFor="pdf">Select pdf</Label>
        <Input id="pdf" type="file" accept=".pdf" onChange={handleFileChange} />

        <Button
          className="w-full"
          loading={loadingDocument || isCreateEmbeddingLoading}
          disabled={text.length === 0 || loadingDocument}
          onClick={() => handleCreateEmbedding(text, name)}
        >
          Save
        </Button>
        {isCreateEmbeddingError && <p>Error</p>}
      </div>
      <div className="absolute bottom-0 right-0 top-0 mx-4 flex w-1/2 flex-col overflow-auto">
        <h2 className="flex">
          <span className="text-xl uppercase underline">Content</span>
        </h2>
        {text ? (
          <p>{text}</p>
        ) : (
          <div className="flex w-full flex-col items-center gap-2 ">
            <File className="h-8 w-8" />
            <p className="">Select file to view it&apos;s content</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReadDocuments;
