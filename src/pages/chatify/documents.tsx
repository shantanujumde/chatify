import DocumentReader from "@/components/documents/documentReader";
import ShowDocuments from "@/components/documents/showDocuments";
import Spinner from "@/components/ui/spinner";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import type { FC } from "react";

const Documents: FC = ({}) => {
  const { status } = useSession();
  const router = useRouter();
  if (status === "loading") {
    return <Spinner />;
  }

  if (status === "unauthenticated") {
    void router.push("/auth/login");
  }

  return (
    <div className="p-4">
      <DocumentReader />
      <ShowDocuments />
    </div>
  );
};

export default Documents;