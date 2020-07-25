export default function Button({ type, label, className, ...rest }) {
  return (
    <button
      type={type}
      {...rest}
      className={`bg-link hover:bg-link-hover text-white text-2xl font-bold px-4 py-1 disabled:bg-gray-400 disabled:text-gray-500 disabled:cursor-not-allowed ${className}`}
    >
      {label}
    </button>
  )
}
