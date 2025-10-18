"use client";

import { useParams } from "next/navigation";
import { InviteLandingPage } from "@/components/InviteLandingPage";

export default function InvitePage() {
  const params = useParams();
  const shareId = params.shareId as string;

  return <InviteLandingPage shareId={shareId} />;
}
