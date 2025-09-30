export const imageLink = (url: string) => {
  const relativeOrAbsoluteUrl = url;
  if (!url || url.includes("s3.eu")) return "/images/wallpaper/19.webp";
  return relativeOrAbsoluteUrl?.startsWith("http")
    ? relativeOrAbsoluteUrl
    : `${process.env.STRAPI_URL}${relativeOrAbsoluteUrl}`;
};