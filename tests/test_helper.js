const bcrypt = require('bcrypt')
const User = require('../models/user')

const initialBlogs = [
  {
    description: 'Sample',
    title: 'Webpack for Static Sites',
    url: 'https://medium.com/riow/webpack-for-static-sites-9cbfd8363abb',
  },
  {
    description: 'Lorem Ipsum',
    title: 'Connecting Jest and Mongoose',
    url: 'https://zellwk.com/blog/jest-and-mongoose/',
  },
  {
    description: 'logrocket',
    title: 'Patterns for data fetching in React',
    url:
      'https://blog.logrocket.com/patterns-for-data-fetching-in-react-981ced7e5c56/',
  },
  {
    description: 'Matt Readout',
    title: 'Adding CSS Animations with Styled Components',
    url:
      'https://medium.com/@matt.readout/adding-css-animations-with-styled-components-6c191c23b6ba',
  },
  {
    description: 'Mike Riethmuller',
    title: 'Fluid typography examples',
    url: 'https://www.madebymike.com.au/writing/fluid-type-calc-examples/',
  },
]

const createUserInDb = async (name, username, password) => {
  const passwordHash = await bcrypt.hash(password, 10)
  const user = new User({ name, passwordHash, username })
  const savedUser = await user.save()
  return savedUser
}



module.exports = { createUserInDb, initialBlogs }
