import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export function useAvatar(avatarFileId: Id<"_storage"> | null | undefined) {
  const avatarUrl = useQuery(
    api.auth.getAvatarUrl,
    avatarFileId ? { avatarFileId } : "skip"
  );

  return avatarUrl;
}


