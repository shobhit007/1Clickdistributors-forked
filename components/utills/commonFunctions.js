export const camelToTitle = (str) => {
  return str
    ?.replace(/([A-Z])/g, " $1")
    .replace(/^./, function (str) {
      return str.toUpperCase();
    })
    .replace("Top", " ");
};
