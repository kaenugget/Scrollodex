import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export function useAvatar(avatarFileId: string | null | undefined) {
  const avatarUrl = useQuery(
    api.auth.getAvatarUrl,
    avatarFileId ? { avatarFileId } : "skip"
  );

  return avatarUrl;
}


