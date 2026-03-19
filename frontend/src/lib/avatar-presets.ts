export const UPLOADED_AVATARS = [
  "/avatars/male-01.png",
  "/avatars/male-02.png",
  "/avatars/male-03.png",
  "/avatars/female-01.png",
  "/avatars/female-02.png",
] as const;

export const getAllowedAvatar = (avatar?: string | null) =>
  avatar && UPLOADED_AVATARS.includes(avatar as (typeof UPLOADED_AVATARS)[number])
    ? avatar
    : UPLOADED_AVATARS[0];
