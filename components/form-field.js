import { useField } from 'formik'

export default function FormField({ textarea, label, ...props }) {
  const [field, meta, helpers] = useField(props)

  return (
    <div className='flex flex-col mb-6'>
      <label className='mr-2 mb-1 text-lg text-white font-bold'>{label}</label>
      {textarea ? (
        <textarea
          {...field}
          {...props}
          rows={8}
          spellCheck={false}
          className='border-2 border-black text-lg p-1 rounded-none focus:bg-gray-100 focus:outline-none focus:border-link resize-none'
        />
      ) : (
        <input
          {...field}
          {...props}
          spellCheck={false}
          className='border-2 border-black text-lg p-1 rounded-none focus:bg-gray-100 focus:outline-none focus:border-link'
        />
      )}

      {meta.touched && meta.error ? (
        <div className='error'>{meta.error}</div>
      ) : null}
    </div>
  )
}
