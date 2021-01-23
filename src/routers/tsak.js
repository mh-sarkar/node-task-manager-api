const express = require('express')
const auth = require('../middleware/auth')
const Task = require('../models/task')

const router = new express.Router()


router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        author: req.user._id
    })

    try {
        await task.save()
        res.status(201).send(task)
    } catch (error) {
        res.status(400).send(error)
    }

    // task.save().then(()=>{
    //     res.status(201).send(task)
    // }).catch((e)=>{
    //     res.status(400).send(e)
    // })
})


//GET /tasks?completed=true
//GET /task?limit=1&skip=1
//GER /task?sortBy=createdAt:desc
router.get('/tasks', auth, async (req, res) => {
    const match = {}
    const sortBy = {}

    if (req.query.completed) {
        match.completed = req.query.completed === 'true'
    }

    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        sortBy[parts[0]] = parts[1] === 'desc'? -1 : 1
    }

    try {
        // await req.user.populate( {
        //     path: 'tasks',
        //     match: {
        //         completed: true
        //     }
        // } ).execPopulate()


        const tasks = await Task.find({ author: req.user._id })
            .where(match)
            .limit(parseInt(req.query.limit))
            .skip(parseInt(req.query.skip))
            .sort(sortBy)
        res.send(tasks)
    } catch (error) {
        res.status(500).send()
    }

    // Task.find({}).then((tasks)=>{
    //     res.send(tasks)
    // }).catch((e)=>{
    //     res.status(500).send()
    // })
})

router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id

    try {
        const task = await Task.findOne({ author: req.user._id, _id })
        if (!task) {
            return res.status(404).send()
        }
        res.send(task)
    } catch (error) {
        res.status(500).send()
    }

    // Task.findById(_id).then((task)=>{
    //     if(!task){
    //         return res.status(404).send()
    //     }

    //     res.send(task)
    // }).catch((e)=>{
    //     res.status(500).send()
    // })
})

router.patch('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id
    const updates = Object.keys(req.body)
    const allowToUpdate = ['description', 'completed']
    const isValidToUpdate = updates.every((update) => allowToUpdate.includes(update))
    if (!isValidToUpdate) {
        return res.status(400).send({ error: 'Invalid Updates' })
    }

    try {

        const task = await Task.findOne({ _id, author: req.user._id })

        updates.forEach((update) => task[update] = req.body[update])

        await task.save()

        // const task = await Task.findByIdAndUpdate(_id,req.body,{new:true, runValidators: true})
        if (!task) {
            return res.status(404).send()
        }
        res.send(task)
    } catch (error) {
        res.status(400).send(error)
    }
})

router.delete('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id
    try {
        const task = await Task.findOneAndDelete({ _id, author: req.user._id })
        if (!task) {
            return res.status(404).send()
        }
        res.send(task)
    } catch (error) {
        res.status(505).send()
    }
})


module.exports = router