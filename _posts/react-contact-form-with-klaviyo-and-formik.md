---
type: 'post'
title: 'React Contact Form With Klaviyo & Formik'
excerpt: 'Learn how to create a simple React Contact Form with NextJS, Klaviyo, and Formik. Email message directly to yourself for free without having to build a server.'
coverImage: '/assets/blog/react-contact-form-with-klaviyo-and-formik/cover.jpg'
date: '2020-08-30'
author:
  name: BVG Software
  picture: '/assets/blog/authors/bvg.jpg'
---

## Introduction

[Klaviyo](https://www.klaviyo.com/) is generally known as a platform to help websites gather contacts and deliver marketing emails. It is certainly a powerful tool, complete with deep analytics, many eccommerce integrations, and great design tools.

In addition to these features, Klaviyo also offers a [Track API](https://www.klaviyo.com/docs/http-api) that can be used by developers to create their own events and pass information to email `Flows` via HTTP requests from a server. This system can be leveraged to create a simple Contact Form that we will essentially email to ourselves.

The Klaviyo free tier allows for 500 emails per month, making this a worthwhile tutorial any developer can easily set up. Create an account if you don't already have one.

In `Account -> Settings -> API Keys` you will be supplied a 6 character API Key. You will need this later.

It should be noted that the Klaviyo API can be used from any server side language, provided that language gives you the ability to send an HTTP `GET` request and deliver a Base64 and JSON endcoded string (which contains the data associated with event).

There are offical and unofficial libraries wrapping the Klaviyo API in a number of languages, but in my opinion these are not needed here.

## Environment

I am actually using the email Contact Form from this site as the example in this article. As such, I am working with [NextJS](https://nextjs.org/), a React framework supporting server side rendering. I am also using the library [Formik](https://formik.org/) to build and handle form actions.

Check out my post on [Full Stack React, Formik & Yup](https://bvgsoftware.com/posts/react-form-validation-with-formik-graphql-yup) for a more thorough example with respect to React form construction.

Install Formik into a JavaScript project with the following command.

We will also use [Cors](https://github.com/expressjs/cors) and [Axios](https://github.com/axios/axios) to facilitate HTTP communication between our frontend, API, and Klaviyo.

```bash
npm i formik cors axios
```

## The Form

For this tutorial, we will use the Contact Form located on the home page of this website. A very basic setup to send me a message, along with the name and email of the user.

<img src="/assets/blog/react-contact-form-with-klaviyo-and-formik/contact-form.jpg" alt="Contact Form Example" />

First we will create a structural form component, and then it will be wrapped in the `withFormik` higher order component.

Note that I have removed the CSS classnames from all components for simplicity. Style yours as you see fit.

### Form Field Component

The basic building block of the form is the `Form Field` component. This can be modified to handle most inputs, and in this case we need the following:

- A text input for the `name` field
- An email input for the `email` field
- A textarea for the `message` field

<div class="filename">form-field.js</div>

```js
import { useField } from 'formik'

export default function FormField({ textarea, label, ...props }) {
  const [field] = useField(props)

  return (
    <div>
      <label>{label}</label>
      {textarea ? (
        <textarea {...field} {...props} rows={8} spellCheck={false} />
      ) : (
        <input {...field} {...props} spellCheck={false} />
      )}
    </div>
  )
}
```

The newish `useField` hook from Formik allows us to automatically spread properties and event listeners to our inputs. This works because we will be wrapping the `FormField` using `withFormik`.

We create a `boolean` called `textarea` to determine which basic HTML structure to use. Make this a string to create logic for more complex use cases, such as `select` dropdowns.

The `label` is self explanatory.

Any other props we pass are spead to the underlying form input.

### Form Structure Component

The `ContactForm` component lays out the basic JSX of the form.

Pass the `handleSubmit` prop to a basic HTML `form` element and use a `button` element of type `submit`.

The `type` and `required` props will provide the necessary field level validation, which is built into HTML5.

<div class="filename">form.js</div>

```js
import FormField from './form-field'

function ContactForm({ handleSubmit }) {
  return (
    <section>
      <h2>Contact Us</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <FormField type='text' name='name' label='Name' required />
          <FormField type='email' name='email' label='Email' required />
          <FormField textarea name='message' label='Message' required />
          <button type='submit'>Submit</button>
        </div>
      </form>
    </section>
  )
}
```

### Higher Order Component

The `withFormik` HOC takes a configuration object with a number of properties. In this case we only need 3 of them.

`mapPropsToValues` supplies the inital values for our form which match the names of our `FormField` components. These all begin as an empty string.

`handleSubmit` utilizes the Axios library to make a simple `POST` request to an api endpoint that we will create in the next step. With the help of `async/await` we wait for the request to complete and then reset the form fields.

`displayName` is helpful for debugging purposes, giving the component a human readable name.

```js
import { withFormik } from 'formik'
import Axios from 'axios'

export default withFormik({
  mapPropsToValues: () => ({ name: '', email: '', message: '' }),

  handleSubmit: async (values, { resetForm }) => {
    await Axios({
      method: 'POST',
      url: '/api/contact',
      data: {
        ...values
      }
    })
    resetForm()
  },

  displayName: 'ContactForm'
})(ContactForm)
```

### API Endpoint

The NextJS setup I am using allows us to create a basic API without having to create a full blown server from scratch, but you could certainly go that route as well. To accomplish this we need to navigate to our `pages` directory and create the needed file structure.

```bash
cd pages
mkdir api
cd api
touch contact.js
```

The individual filenames within the `/pages/api` directory correspond to the path of each endpoint.

The `initMiddleware` function helps us establish `cors` to allow Cross Origin Resource sharing between servers.

We export a `handler` function that takes a `request` and `response` as arguments. Once we call `cors` we can proceed with our request to Klaviyo. \

While there are libraries out there that abstract the Klaviyo APIs, they are not needed, our [Node](https://nodejs.org/) environment provides the JSON and Base64 encoding that is required by Klaviyo.

Create a `data` object with the format I have outlined, passing the API Key as `token`, an arbitrary name as `event`, your own email as `customer_properties.$email` and the form values from `req.body` as `properties`, again with arbitrary names.

Finally, make a `GET` reqest to the Klaviyo Track API at `https://a.klaviyo.com/api/track` and attach the `data` object as a URL parameter, using built in functionality to format the payload properly.

I enclose all logic in a `try/catch` to provide error handling and to give the frontend an idea of how everything went. While I don't utilize this response in this project, you would simply assign a variable to the Axios `POST` request and then check it to determine your UI.

```js
import Cors from 'cors'
import Axios from 'axios'

function initMiddleware(middleware) {
  return (req, res) =>
    new Promise((resolve, reject) => {
      middleware(req, res, (result) => {
        if (result instanceof Error) {
          return reject(result)
        }
        return resolve(result)
      })
    })
}

const cors = initMiddleware(
  Cors({
    methods: ['GET', 'POST', 'OPTIONS']
  })
)

export default async function handler(req, res) {
  await cors(req, res)

  const data = {
    token: 'XXXXXX',
    event: 'Contact Form',
    customer_properties: {
      $email: 'you@gmail.com'
    },
    properties: {
      Name: req.body.name,
      Email: req.body.email,
      Message: req.body.message
    }
  }

  try {
    await Axios({
      method: 'GET',
      url: `https://a.klaviyo.com/api/track?data=${Buffer.from(
        JSON.stringify(data)
      ).toString('base64')}`
    })
    res.json({ success: true })
  } catch (error) {
    res.json({ success: false })
  }
}
```

## Klaviyo Flow

Once the first `GET` request is sent to the Klaviyo system, go to your account and check the `Metrics` page. You should see a new metric that corresponds to the name of your `event`. Navigate to the Activity Feed for `Contact Form` and the first event with all the attached data should be listed. Cool, right?

<img src="/assets/blog/react-contact-form-with-klaviyo-and-formik/contact-form-metric.jpg" alt="Contact Form Metric" />

Now you can follow the ['Create A Flow' Article From Klaviyo](https://help.klaviyo.com/hc/en-us/articles/115002775012-Create-a-Flow), using the `Contact Form` metric as a trigger. You can use one of their templates, or just create the email from scratch. Klaviyo has a high quality drag and drop editor to create impressive emails.

To pull in the contents of our form use `{{ event.property }}` directly within a Text Block, replacing property with `Name`, `Email`, or `Message` in this case.

<img src="/assets/blog/react-contact-form-with-klaviyo-and-formik/create-flow.jpg" alt="Create Email Template" />

Add a logo to fancy things up.

As a side note, the Klaviyo logo is hidden on paid accounts.

## Conclusion

Armed with the ability to create custom Klaviyo metrics, you can create a great Contact Form or systems which go much, much further beyond this basic example.

At work I have automated quote requests, shipping notifications, and tracking links with variations of the methods outlined in this article. A custom metric can accept links, images or any other data you work with. Flows can incorporate a series of different emails with delays, logical forks, and filtering. Klaviyo provides granular analytics for sending and engagment. The Track API makes much of this possible.
