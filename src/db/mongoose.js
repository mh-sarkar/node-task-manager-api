const mongoose = require('mongoose')
const validator = require('validator')

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
})



// const addUser = new User({
//     name: "Rayed",
//     email: "ra@jbfg.co",
//     password: "Hello123",
//     age: 23,
// })

// addUser.save().then(() => {
//     console.log(addUser)
// }).catch((error) => {
//     console.log(error)
// })
// console.log('dfjlkdngpassWorddkfbgj'.toLowerCase().includes('password'))




// const addTask = new Task({
//     description: "Run this command",
//     completed: false
// })

// addTask.save().then(()=>{
//     console.log(addTask)
// }).catch((error)=>{
//     console.log(error)
// })