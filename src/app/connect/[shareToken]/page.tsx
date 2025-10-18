"use client";

import { useParams } from "next/navigation";
import { UserConnectView } from "@/components/UserConnectView";

export default function UserConnectPage() {
  const params = useParams();
  const shareToken = params.shareToken as string;

  return <UserConnectView shareToken={shareToken} />;
}
