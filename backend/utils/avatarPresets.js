export const UPLOADED_AVATARS = [
  "/avatars/male-01.png",
  "/avatars/male-02.png",
  "/avatars/male-03.png",
  "/avatars/female-01.png",
  "/avatars/female-02.png",
];

export const isAllowedAvatar = (avatar) => UPLOADED_AVATARS.includes(avatar);

export const getAllowedAvatar = (avatar) =>
  isAllowedAvatar(avatar) ? avatar : UPLOADED_AVATARS[0];
