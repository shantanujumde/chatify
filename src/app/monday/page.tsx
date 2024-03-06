"use server";
import { FC } from "react";
import { ClientButton } from "./components/clientButton";

interface MondayProps {}

const Monday: FC<MondayProps> = async ({}) => {
  return <ClientButton />;
};

export default Monday;
