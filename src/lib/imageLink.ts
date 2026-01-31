export const imageLink = (url: string) => {
  const relativeOrAbsoluteUrl = url;
  console.log("imageLink called with url:", url);
  if (!url || url?.includes?.("s3.eu")) return "";
  return relativeOrAbsoluteUrl?.startsWith("http")
    ? relativeOrAbsoluteUrl
    : `${process.env.STRAPI_URL}${relativeOrAbsoluteUrl}`;
};