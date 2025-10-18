interface GoogleSignInButtonProps {
    onSuccess?: () => void;
    text?: string;
    className?: string;
}
declare global {
    interface Window {
        google: {
            accounts: {
                id: {
                    initialize: (config: {
                        client_id: string;
                        callback: (response: GoogleCredentialResponse) => void;
                    }) => void;
                    renderButton: (element: HTMLElement, config: {
                        theme?: string;
                        size?: string;
                    }) => void;
                    prompt: () => void;
                };
            };
        };
    }
}
interface GoogleCredentialResponse {
    credential: string;
}
export declare function GoogleSignInButton({ onSuccess, text, className }: GoogleSignInButtonProps): import("react").JSX.Element;
export {};
//# sourceMappingURL=GoogleSignInButton.d.ts.map