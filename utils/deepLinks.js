export const screenLinks = {
  index: "", 
  HelpNearby: "help",
  ImpactEvents: "events",
  Moments: "moments",
  UrgentHelp: "urgent",
  Profile: "profile",
  signIn:"signin"
};

export const getDeepLink = (screen) => {
  const isProd = !__DEV__; // dev vs prod
  const scheme = isProd ? "https://setuhub.io/" : "setuhub://";
  return `${scheme}${screenLinks[screen]}`;
};
