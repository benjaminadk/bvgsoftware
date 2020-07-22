import { withFormik } from 'formik'

function FrontContact({
  values,
  touched,
  errors,
  handleChange,
  handleBlur,
  handleSubmit
}) {
  return (
    <section>
      <h2 className='mt-20 mb-8 text-6xl md:text-7xl text-center font-bold tracking-tighter leading-tight'>
        Contact Us
      </h2>

      <form className='flex flex-col items-center' onSubmit={handleSubmit}>
        <label>
          <span className='mr-2'>Name</span>
          <input
            type='text'
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.name}
            name='name'
            className='border'
          />
        </label>

        {errors.name && touched.name && <div id='feedback'>{errors.name}</div>}
        <button type='submit'>Submit</button>
      </form>
    </section>
  )
}

export default withFormik({
  mapPropsToValues: () => ({ name: '' }),

  handleSubmit: (values, { setSubmitting }) => {
    setSubmitting(false)
  },

  displayName: 'FrontContact'
})(FrontContact)
