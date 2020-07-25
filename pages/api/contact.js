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

  const error = await Axios({
    method: 'POST',
    url:
      'https://iyog04wwel.execute-api.us-west-2.amazonaws.com/default/bvgsoftwareEmail',
    data: req.body
  })

  res.json({ success: !!error ? false : true })
}
