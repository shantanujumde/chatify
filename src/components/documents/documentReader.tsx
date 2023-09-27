import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useReadText } from "@/hooks/readTextFromDocument";
import { api } from "@/utils/api";
import React from "react";
import { Button } from "../ui/button";

const DocumentReader: React.FC = () => {
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
      text,
      text_date: new Date().toISOString(),
      text_title: name,
      text_url: name,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    getTextFromDoc(e);
  };

  return (
    <div>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="pdf">Select pdf</Label>
        <Input id="pdf" type="file" accept=".pdf" onChange={handleFileChange} />
        <p>PDF Text Content:</p>
        <p>{text}</p>

        <Button
          loading={loadingDocument || isCreateEmbeddingLoading}
          disabled={text.length === 0 || loadingDocument}
          onClick={() => handleCreateEmbedding(text, name)}
        >
          Create Embedding
        </Button>
        {isCreateEmbeddingError && <p>Error</p>}
      </div>
    </div>
  );
};

export default DocumentReader;
