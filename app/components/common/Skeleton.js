export default function Skeleton({ className = "", style = {}, ...props }) {
  return <div className={`animate-pulse bg-gray-200 rounded ${className}`} style={style} {...props} />;
}
