export const Card = ({ children, className = '', rotation = 'rotate-1', hoverRotation = '-rotate-2' }) => {
  return (
    <div className={`bg-white rounded-3xl shadow-lg border-3 border-indigo-200 p-6 transition-all duration-300 ${rotation} hover:${hoverRotation} hover:shadow-xl hover:-translate-y-2 ${className}`}>
      {children}
    </div>
  );
};