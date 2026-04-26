"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { assignPeerReviewAction } from "@/server/actions/peer-review.actions";

interface AssignPeerReviewButtonProps {
  tahapId: string;
  alreadyAssigned: boolean;
}

export default function AssignPeerReviewButton({
  tahapId,
  alreadyAssigned,
}: AssignPeerReviewButtonProps) {
  const [isPending, startTransition] = useTransition();

  function handleAssign() {
    startTransition(async () => {
      const result = await assignPeerReviewAction(tahapId);
      if (result.error) {
        toast.error(result.error);
      } else if (result?.data?.assigned === 0) {
        toast.info("Semua submission sudah memiliki reviewer.");
      } else {
        toast.success(
          `${result?.data?.assigned} peer review berhasil di-assign!`,
        );
      }
    });
  }

  return (
    <Button
      variant={alreadyAssigned ? "outline" : "secondary"}
      size="sm"
      onClick={handleAssign}
      disabled={isPending}
      className="gap-2"
    >
      <Users className="h-4 w-4" />
      {isPending
        ? "Memproses..."
        : alreadyAssigned
          ? "Re-assign Peer Review"
          : "Assign Peer Review"}
    </Button>
  );
}
