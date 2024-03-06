"use server";
import { FC } from "react";
import SummaryButton from "../components/summaryButton";

interface SummaryProps {}

const Summary: FC<SummaryProps> = ({}) => {
  return (
    <>
      <SummaryButton />
    </>
  );
};

export default Summary;
