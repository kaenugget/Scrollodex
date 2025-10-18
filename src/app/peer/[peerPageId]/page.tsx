"use client";

import { useParams } from "next/navigation";
import { PeerPageView } from "@/components/PeerPageView";

export default function PeerPage() {
  const params = useParams();
  const peerPageId = params.peerPageId as string;

  return <PeerPageView peerPageId={peerPageId} />;
}
