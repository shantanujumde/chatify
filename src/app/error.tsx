"use client";

import { Button } from "@/components/ui/button";

const error = ({ error, reset }: { error: Error; reset: () => void }) => {
  return (
    <div>
      {error.message},<Button onClick={() => reset()}>Try Again</Button>
    </div>
  );
};

export default error;
