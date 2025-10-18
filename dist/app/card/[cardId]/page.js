"use client";
import { useParams } from "next/navigation";
import { CardDetailView } from "@/components/CardDetailView";
export default function CardPage() {
    const params = useParams();
    const cardId = params.cardId;
    return <CardDetailView cardId={cardId}/>;
}
//# sourceMappingURL=page.js.map