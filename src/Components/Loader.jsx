import ContentLoader from "react-content-loader";

const Loader = () => (
  <div className="w-full min-h-screen flex items-center justify-center bg-white">
    <ContentLoader
      speed={1.5}
      width="100%"
      height={400}
      viewBox="0 0 1000 400"
      backgroundColor="#f3f3f3"
      foregroundColor="#e0e0e0"
      className="w-full max-w-6xl"
    >
      {/* Title */}
      <rect x="0" y="10" rx="5" ry="5" width="300" height="24" />

      {/* Filter or button row */}
      <rect x="0" y="50" rx="5" ry="5" width="150" height="20" />
      <rect x="160" y="50" rx="5" ry="5" width="100" height="20" />
      <rect x="270" y="50" rx="5" ry="5" width="120" height="20" />

      {/* Table headers */}
      <rect x="0" y="90" rx="4" ry="4" width="1000" height="20" />

      {/* Table rows */}
      {[...Array(6)].map((_, i) => (
        <rect
          key={i}
          x="0"
          y={120 + i * 40}
          rx="4"
          ry="4"
          width="1000"
          height="20"
        />
      ))}
    </ContentLoader>
  </div>
);

export default Loader;
