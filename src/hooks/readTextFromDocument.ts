import * as pdfjs from "pdfjs-dist";
import { useState } from "react";

export const useReadText = (): [
  string,
  (e: React.ChangeEvent<HTMLInputElement>) => void
] => {
  const [text, setText] = useState<string>("");

  return [
    text,
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const fileExtension = file.name.split(".").pop();

      switch (fileExtension) {
        case "pdf":
          readPdf(file, setText);

        default:
          break;
      }
    },
  ];
};

const readPdf = (file: File, setText: (text: string) => void) => {
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
