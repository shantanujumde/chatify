import * as pdfjs from "pdfjs-dist";
import { useState, type Dispatch, type SetStateAction } from "react";

type Text = { text: string; name: string; states: { loading: boolean } };
export const useReadText = (): [
  Text,
  (e: React.ChangeEvent<HTMLInputElement>) => void
] => {
  const [text, setText] = useState<Text>({
    text: "",
    name: "",
    states: { loading: false },
  });

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

const readPdf = (file: File, setText: Dispatch<SetStateAction<Text>>) => {
  setText((curr) => ({ ...curr, states: { loading: true } }));

  const reader = new FileReader();

  reader.onload = async () => {
    const pdfData = new Uint8Array(reader.result as ArrayBuffer);

    try {
      // Initialize PDF.js
      pdfjs.GlobalWorkerOptions.workerSrc = "../scripts/pdf.worker.min.js";
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
        if ("str" in item) {
          pageTextArray.push(item.str);
        }
      }
      const pageTextString = pageTextArray.join(" ");

      setText({
        text: pageTextString,
        name: file.name,
        states: { loading: false },
      });
    } catch (error) {
      console.error("Error parsing PDF:", error);
      setText((curr) => ({ ...curr, states: { loading: false } }));
    }
  };

  reader.readAsArrayBuffer(file);
};
