import React from "react";
import ContentLoader from "react-content-loader";

const Loader = (props) => (
  <div className="flex justify-center items-center min-h-[300px]">
    <ContentLoader
      speed={2}
      width={500}
      height={300}
      viewBox="0 0 500 300"
      backgroundColor="#f3f3f3"
      foregroundColor="#ecebeb"
      {...props}
    >
      {/* X-axis line */}
      <rect x="0" y="270" rx="0" ry="0" width="500" height="2" />

      {/* Y-axis bars */}
      <rect x="40" y="100" rx="4" ry="4" width="30" height="170" />
      <rect x="100" y="140" rx="4" ry="4" width="30" height="130" />
      <rect x="160" y="80" rx="4" ry="4" width="30" height="190" />
      <rect x="220" y="120" rx="4" ry="4" width="30" height="150" />
      <rect x="280" y="160" rx="4" ry="4" width="30" height="110" />
      <rect x="340" y="90" rx="4" ry="4" width="30" height="180" />
      <rect x="400" y="130" rx="4" ry="4" width="30" height="140" />
    </ContentLoader>
  </div>
);

export default Loader;
