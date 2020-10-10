const { getMetadata } = require('page-metadata-parser')
const domino = require('domino')
const axios = require('axios')

/**
 * https://github.com/mozilla/page-metadata-parser/
 *
 * @param {string} url (should be valid url)
 * @returns {object} with keys: description, icon, image, keywords, title, language, type, url, provider
 *
 */

const getMeta = async (url) => {
  try {
    const response = await axios.get(url)
    //console.log('typeof response', typeof response)
    const html = response.data
    const doc = domino.createWindow(html).document
    const metadata = getMetadata(doc, url)
    //console.log('getMeta > metadata: ', metadata)
    return metadata
  } catch (error) {
    return { error: error.message }
  }
}

module.exports = { getMeta }
