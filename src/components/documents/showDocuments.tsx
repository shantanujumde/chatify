import { api } from "@/utils/api";
import {
  CheckCircledIcon,
  CircleIcon,
  Pencil2Icon,
  TrashIcon,
} from "@radix-ui/react-icons";
import type { FC } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import Spinner from "../ui/spinner";

const ShowDocuments: FC = () => {
  const documents = api.documents.getMyDocuments.useQuery();
  if (documents.isLoading) return <Spinner />;

  if (!documents.data) return <>Empty</>;
  console.log("documents", documents);

  return (
    <Accordion type="single" collapsible className="w-full">
      {documents.data.map((document) => {
        return (
          <AccordionItem key={document.id} value={document.id.toString()}>
            <AccordionTrigger>
              <CircleIcon />
              <CheckCircledIcon /> {document.name} <Pencil2Icon /> <TrashIcon />
            </AccordionTrigger>
            <AccordionContent>{document.content}</AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
};

export default ShowDocuments;
