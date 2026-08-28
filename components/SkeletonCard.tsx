export const SkeletonCard = () => {
  return (
    <div className="p-6 border border-gray-100 rounded-3xl bg-white shadow-sm animate-pulse">
      {/* High-Fidelity Image Placeholder */}
      <div className="w-full h-48 bg-gray-200 rounded-2xl mb-6"></div>
      
      {/* Icon Placeholder */}
      <div className="w-10 h-10 bg-gray-200 rounded-lg mb-4"></div>
      
      {/* Title Placeholder */}
      <div className="h-6 bg-gray-200 rounded-lg w-3/4 mb-4"></div>
      
      {/* Price Placeholder */}
      <div className="h-8 bg-gray-200 rounded-lg w-1/2 mb-6"></div>
      
      {/* Button Placeholder */}
      <div className="w-full h-12 bg-gray-200 rounded-xl"></div>
    </div>
  );
};