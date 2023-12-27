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

      const numOfPages = pdf.numPages;

      // Read text from the first page (you can iterate through pages if needed)
      let accText = "";
      for (let i = 1; i <= numOfPages; i++) {
        const page = await pdf.getPage(i);
        const pageTextContent = await page.getTextContent();

        const text = pageTextContent.items
          .map((item) => "str" in item && item.str)
          .join(" ");

        accText += text;
      }

      setText({
        text: accText,
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
