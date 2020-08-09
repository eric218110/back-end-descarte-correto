import express from 'express'

const app = express()
const port = process.env.PORT || 1995
app.listen(port, () => console.log(`Server runing in port ${port}`))
