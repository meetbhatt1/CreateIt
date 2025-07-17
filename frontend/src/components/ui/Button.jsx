export const Button = ({ children, onClick, className = '', variant = 'primary' }) => {
  const baseClasses = "px-6 py-3 rounded-3xl font-semibold transition-all duration-300 hover:-translate-y-1 hover:shadow-lg";
  const variants = {
    primary: "bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700",
    secondary: "bg-gradient-to-r from-purple-400 to-purple-600 text-white hover:from-purple-500 hover:to-purple-700"
  };
  
  return (
    <button 
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};