const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/tsak')
const app = express()

const port = process.env.PORT

// app.use((req, res, next)=>{
//     res.status(503).send('server is in maintenance mode!')
// })

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)




app.listen(port, () => {
    console.log('server is up to on port ' + port)
})