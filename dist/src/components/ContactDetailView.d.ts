import React from 'react';
import { Id } from "../../convex/_generated/dataModel";
interface ContactDetailViewProps {
    contactId: string;
    userId: Id<"users">;
    activeTab: "overview" | "notes" | "actions" | "preferences" | "moments";
    onTabChange: (tab: "overview" | "notes" | "actions" | "preferences" | "moments") => void;
}
export declare function ContactDetailView({ contactId, userId, activeTab, onTabChange }: ContactDetailViewProps): React.JSX.Element;
export {};
//# sourceMappingURL=ContactDetailView.d.ts.map