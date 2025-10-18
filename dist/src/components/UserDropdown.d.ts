import React from 'react';
interface UserDropdownProps {
    user: {
        _id: string;
        displayName?: string;
        avatarUrl?: string;
    };
    onSignOut: () => void;
}
export declare const UserDropdown: React.FC<UserDropdownProps>;
export {};
//# sourceMappingURL=UserDropdown.d.ts.map