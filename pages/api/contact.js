import Cors from 'cors'
import Axios from 'axios'

import initMiddleware from '../../lib/init-middleware'

const cors = initMiddleware(
  Cors({
    methods: ['GET', 'POST', 'OPTIONS']
  })
)

export default async function handler(req, res) {
  await cors(req, res)

  // Old AWS Sytem
  // const error = await Axios({
  //   method: 'POST',
  //   url:
  //     'https://iyog04wwel.execute-api.us-west-2.amazonaws.com/default/bvgsoftwareEmail',
  //   data: req.body
  // })

  // res.json({ success: !!error ? false : true })

  const data = {
    token: 'PpS4mB',
    event: 'Contact Form',
    customer_properties: {
      $email: 'ben@bvgsoftware.com'
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
