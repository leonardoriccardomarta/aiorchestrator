const Button = ({ children, onClick, className }) => {
  return (
    <button 
      onClick={onClick} 
      className={`bg-primary text-white py-3 px-6 rounded-lg hover:bg-primary-dark transition-all duration-300 ${className}`}>
      {children}
    </button>
  );
};

export default Button;
