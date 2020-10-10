const validator = require('validator')
const { getMeta } = require('../services/metadata-parser')


const getMetaData = async (req, res, next) => {
  if (
    !validator.isURL(req.body.url, {
      protocols: ['http', 'https'],
      require_protocol: true,
    })
  ) {
    return res.status(400).json({ error: 'url is not valid' })
  }

  const metadata = await getMeta(req.body.url)

  /* if (!metadata.title || !metadata.description) {
  return res.status(400).json({ error: "couldn't get data" })
} */
  const meta = {
    description: metadata.description ? metadata.description : '',
    title: metadata.title,
    url: metadata.url,
  }
  //console.log('meta:', meta)
  res.json(meta)
}
module.exports = { getMetaData }
