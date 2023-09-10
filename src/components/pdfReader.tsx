import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useReadText } from "@/hooks/readText";
import * as pdfjs from "pdfjs-dist";
import React, { useState } from "react";

const PdfParser: React.FC = () => {
  const [text, setText] = useState<string>("");
  const [textU, setTextU] = useReadText();
  console.log("text from useReadText", textU);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTextU(e);
    const file = e.target.files?.[0];
    console.log("file", file);

    if (!file) return;

    const reader = new FileReader();

    reader.onload = async () => {
      const pdfData = new Uint8Array(reader.result as ArrayBuffer);

      try {
        // Initialize PDF.js
        pdfjs.GlobalWorkerOptions.workerSrc = "./scripts/pdf.worker.min.js";
        pdfjs.GlobalWorkerOptions.workerPort = new Worker(
          pdfjs.GlobalWorkerOptions.workerSrc
        );

        const pdf = await pdfjs.getDocument({ data: pdfData }).promise;

        // Read text from the first page (you can iterate through pages if needed)
        const page = await pdf.getPage(1);
        const pageTextContent = await page.getTextContent();

        // Extract text from the page
        const pageTextArray: string[] = [];
        for (const item of pageTextContent.items) {
          console.log("item,", item);

          if ("str" in item) {
            pageTextArray.push(item.str);
          }
        }

        const pageTextString = pageTextArray.join(" ");

        setText(pageTextString);
      } catch (error) {
        console.error("Error parsing PDF:", error);
      }
    };

    reader.readAsArrayBuffer(file);
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
