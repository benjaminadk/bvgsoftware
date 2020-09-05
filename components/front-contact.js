import { withFormik } from 'formik'
import axios from 'axios'
import ReCAPTCHA from 'react-google-recaptcha'
import cn from 'classnames'

import FormField from './form-field'
import Button from './form-button'
import { RECAPTCHA_KEY } from '../lib/constants'

function FrontContact({ status, touched, handleSubmit }) {
  const [show, setShow] = React.useState(false)
  const [disabled, setDisabled] = React.useState(true)
  const [thanks, setThanks] = React.useState(false)

  React.useEffect(() => {
    setShow(Object.keys(touched).length)
  }, [touched])

  React.useEffect(() => {
    if (status === 'success' && !thanks) {
      setThanks(true)
    }
  }, [status])

  return (
    <section className='bg-black py-20 mb-40'>
      <h2 className='mb-8 lg:text-8xl text-7xl text-white text-center font-bold tracking-tighter leading-tight'>
        Contact Us
      </h2>

      <form className='flex flex-col items-center' onSubmit={handleSubmit}>
        <div className='lg:w-1/3 w-11/12 flex flex-col mb-10'>
          <FormField type='text' name='name' label='Name' required />
          <FormField type='email' name='email' label='Email' required />
          <FormField textarea name='message' label='Message' required />
          <div
            className={cn('flex justify-center', {
              hidden: !show
            })}
          >
            <ReCAPTCHA
              sitekey={RECAPTCHA_KEY}
              onChange={(value) => setDisabled(!value)}
            />
          </div>
          <Button
            className='mt-4'
            type='submit'
            label='Submit'
            disabled={disabled}
          />
        </div>
      </form>

      {thanks && (
        <h4 className='text-white text-center font-bold tracking-tighter leading-tight'>
          Thank You For Reacting Out!
        </h4>
      )}
    </section>
  )
}

export default withFormik({
  mapPropsToValues: () => ({ name: '', email: '', message: '' }),

  handleSubmit: async (values, { setSubmitting, setStatus, resetForm }) => {
    const success = await axios({
      method: 'POST',
      url: '/api/contact',
      data: {
        ...values
      }
    })

    if (success) {
      setStatus('success')
    } else {
      setStatus('error')
    }

    setSubmitting(false)
    resetForm()
  },

  displayName: 'FrontContact'
})(FrontContact)
