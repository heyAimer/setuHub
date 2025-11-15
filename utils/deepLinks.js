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

export const deepLinkToRoute = {
  "": "/",
  help: "/(tabs)/HelpNearby",
  events: "/(tabs)/ImpactEvents",
  moments: "/(tabs)/Moments",
  urgent: "/(tabs)/UrgentHelp",
  profile: "/(tabs)/Profile",
  signin: "/(auth)/signIn"
};