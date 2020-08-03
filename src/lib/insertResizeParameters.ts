export default (
  url: string = `http://res.cloudinary.com/jeesso/image/upload/v1592708234/Images/h6a2svsovbjhkgfomid1.jpg`
) => {
  const parts = url.split("/");
  const uploadIndex = parts.findIndex((value: string) => value === "upload");

  parts.splice(uploadIndex + 1, 0, "w_300,h_300,c_crop");
  return parts.join("/");
};
