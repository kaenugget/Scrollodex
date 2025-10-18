"use client";

import { useParams } from "next/navigation";
import { SharedCardView } from "@/components/SharedCardView";

export default function SharePage() {
  const params = useParams();
  const shareToken = params.shareToken as string;

  return <SharedCardView shareToken={shareToken} />;
}
