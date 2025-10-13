const EmptyState = ({ title, description }) => {
  return (
    <div className="text-center p-8">
      <h2 className="text-xl font-semibold text-gray-600">{title}</h2>
      <p className="text-gray-500">{description}</p>
    </div>
  );
};

export default EmptyState;
