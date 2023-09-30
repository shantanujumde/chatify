import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useReadText } from "@/hooks/readTextFromDocument";
import { api } from "@/utils/api";
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
    <div className="flex">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Label htmlFor="pdf">Select pdf</Label>
        <Input id="pdf" type="file" accept=".pdf" onChange={handleFileChange} />

        <Button
          className="w-full"
          loading={loadingDocument || isCreateEmbeddingLoading}
          disabled={text.length === 0 || loadingDocument}
          onClick={() => handleCreateEmbedding(text, name)}
        >
          Create Embedding
        </Button>
        {isCreateEmbeddingError && <p>Error</p>}
      </div>
      <div className="mx-4 flex flex-col">
        {text && (
          <>
            <p>PDF Text Content:</p>
            {"\n"}
            <p>{text}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default ReadDocuments;
