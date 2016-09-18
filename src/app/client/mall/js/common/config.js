export const config = {
  eruda: {
    name: "____m____",
    token: "cnNzY2NjbmVydWRh",
    closeName: "closedebug",
  },
  mall: {
    cookieOptions: {
      expires: 86400 * 30,
      domain: location.hostname.replace(/^test\./, ""),
      path: "/"
    }
  }
};
