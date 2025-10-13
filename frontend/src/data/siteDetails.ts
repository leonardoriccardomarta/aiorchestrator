export interface ISiteDetails {
  siteName: string;
  description: string;
  logo: string;
}

export const siteDetails: ISiteDetails = {
  siteName: "AI Chatbot Platform",
  description: "Build, deploy, and manage intelligent chatbots for your business",
  logo: "/logo.svg"
};

export interface ISocials {
  [key: string]: string;
}

export const footerDetails = {
  socials: {
    twitter: "https://twitter.com/aichatbot",
    facebook: "https://facebook.com/aichatbot",
    linkedin: "https://linkedin.com/company/aichatbot",
    instagram: "https://instagram.com/aichatbot"
  } as ISocials
}; 