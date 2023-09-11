import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useReadText } from "@/hooks/readTextFromDocument";
import React from "react";

const PdfParser: React.FC = () => {
  const [text, getTextFromDoc] = useReadText();
  console.log("text from useReadText", text);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    getTextFromDoc(e);
  };

  return (
    <div>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="pdf">Select pdf</Label>
        <Input id="pdf" type="file" accept=".pdf" onChange={handleFileChange} />
        <p>PDF Text Content:</p>
        <pre>{text}</pre>
      </div>
    </div>
  );
};

export default PdfParser;
