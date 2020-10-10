const path = require('path')
const frontendRouter = require('express').Router()

frontendRouter.get('*', (req, res) => {
  //console.log(__dirname)
  //console.log("path.join():", path.join('build', 'index.html'))
  //console.log("path.resolve():", path.resolve())
  res.sendFile(path.resolve('build', 'index.html'))
})

module.exports = frontendRouter
