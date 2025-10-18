"use client";
import { useParams } from "next/navigation";
import { UserConnectView } from "@/components/UserConnectView";
export default function UserConnectPage() {
    const params = useParams();
    const shareToken = params.shareToken;
    return <UserConnectView shareToken={shareToken}/>;
}
//# sourceMappingURL=page.js.map