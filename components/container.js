export default function Container({ children, classNames = '' }) {
  return (
    <div className={`container mx-auto px-5 ${classNames}`}>{children}</div>
  )
}
