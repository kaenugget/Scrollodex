"use client";

import { useParams } from "next/navigation";
import { CardDetailView } from "@/components/CardDetailView";

export default function CardPage() {
  const params = useParams();
  const cardId = params.cardId as string;

  return <CardDetailView cardId={cardId} />;
}
