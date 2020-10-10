const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const loginUserToDb = async (req, res, next) => {
  const { username, password } = req.body

  try {
    const user = await User.findOne({
      username,
    })
    const passwordCorrect =
      user === null ? false : await bcrypt.compare(password, user.passwordHash)

    if (!(user && passwordCorrect)) {
      return res.status(401).json({
        error: 'Invalid username or password',
      })
    }

    const userForToken = {
      id: user._id,
      username,
    }

    const token = jwt.sign(userForToken, process.env.SECRET)

    res.status(200).send({
      id: user._id,
      name: user.name,
      token,
      username: user.username,
    })
  } catch (error) {
    //console.log(error.message)
    res.sendStatus(500) && next(error)
  }
}

module.exports = {
  loginUserToDb,
}
