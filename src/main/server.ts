import app from './config/app'

const port = process.env.PORT || 1995
app.listen(port, () => console.log(`Server runing in port ${port}`))
