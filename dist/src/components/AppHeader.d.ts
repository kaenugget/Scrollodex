import React from 'react';
interface AppHeaderProps {
    currentPage: string;
    onNavigate: (page: string) => void;
    user?: {
        _id: string;
        displayName?: string;
        avatarUrl?: string;
    };
    onSignOut?: () => void;
}
export declare const AppHeader: React.FC<AppHeaderProps>;
export {};
//# sourceMappingURL=AppHeader.d.ts.map