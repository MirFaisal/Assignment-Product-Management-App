export default function AddProductIcon(props) {
  return (
    <svg
      className={props.className || "w-5 h-5"}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  );
}
