import { FaTwitter, FaFacebookF, FaLinkedinIn, FaInstagram } from 'react-icons/fa';

export const getPlatformIconByName = (platformName) => {
  const iconClasses = "w-6 h-6 text-gray-600 hover:text-gray-900 transition-colors";
  
  switch (platformName.toLowerCase()) {
    case 'twitter':
      return <FaTwitter className={iconClasses} />;
    case 'facebook':
      return <FaFacebookF className={iconClasses} />;
    case 'linkedin':
      return <FaLinkedinIn className={iconClasses} />;
    case 'instagram':
      return <FaInstagram className={iconClasses} />;
    default:
      return null;
  }
};
