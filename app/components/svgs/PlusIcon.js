export default function PlusIcon(props) {
  return (
    <svg
      className={props.className || "w-4 h-4 mr-2"}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  );
}
