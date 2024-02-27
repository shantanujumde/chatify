"use client";
import { api } from "@/utils/api";

import { format } from "date-fns";
import { useSession } from "next-auth/react";
import { useState, type FC } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

const InvitationDialog: FC = ({}) => {
  const { status } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const { data: inviteMetaData } = api.profile.getInviteUserMetadata.useQuery(
    void 0,
    {
      enabled: status === "authenticated",
      onSuccess: () => setIsOpen(true),
    }
  );

  const { mutate: updateUser, isLoading: updateUserLoading } =
    api.profile.updateUser.useMutation({
      onSettled: () => setIsOpen(false),
    });

  return (
    <Dialog open={isOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>You are invited to organization!</DialogTitle>
          <DialogDescription>
            Upon conforming, you will be unlinked form your previous
            organization
          </DialogDescription>
        </DialogHeader>
        <ul className="text-xl font-semibold">
          <li>
            Invited by:{" "}
            <span className="font-normal">
              {" "}
              {inviteMetaData?.invitedBy?.name}
            </span>
          </li>
          <li>
            Invitee Email:{" "}
            <span className="font-normal text-primary">
              {inviteMetaData?.invitedBy?.email}
            </span>
          </li>
          {inviteMetaData?.invitedOn && (
            <li>
              Date of Invitation:{" "}
              <span className="font-normal">
                {format(new Date(inviteMetaData.invitedOn), "dd MMM yyyy")}
              </span>
            </li>
          )}
          <li>
            Invited to:{" "}
            <span className="font-normal">
              {inviteMetaData?.invitedBy?.organization?.name ??
                inviteMetaData?.invitedToOrganization}
            </span>
          </li>
        </ul>
        <DialogFooter className="sm:justify-start">
          <Button
            loading={updateUserLoading}
            onClick={() =>
              updateUser({
                metaData: null,
                organizationId: inviteMetaData?.invitedToOrganization,
              })
            }
          >
            Accept
          </Button>
          <Button
            loading={updateUserLoading}
            variant="secondary"
            onClick={() => updateUser({ metaData: null })}
          >
            Delete Invitation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InvitationDialog;
