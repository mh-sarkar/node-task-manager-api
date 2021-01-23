const express = require('express')
const multer = require('multer')
const sharp = require('sharp')
const auth = require('../middleware/auth')
const {sendEmail} = require('../emails/account')
const User = require('../models/user')

const upload = multer({
    // dest: 'avatars',
    limits: {
        fieldSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match('\.(jpg|png|jpeg)$')) {
            return cb(new Error('Upload a jpg or png file!'))
        }

        cb(undefined, true)
    }
})

const router = new express.Router()

router.post('/users', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        sendEmail(user.email, user.name)
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (error) {
        res.status(400).send(error)
    }

    // user.save().then(() => {
    //     res.status(201).send(user)
    // }).catch((e) => {
    //     res.status(400).send(e)
    // })
})

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (error) {
        res.status(400).send()
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.send()
    } catch (error) {
        res.status(500).send()
    }

})

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []

        await req.user.save()

        res.send()
    } catch (error) {
        res.status(500).send()
    }
})

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({width:250, height:250}).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

router.get('/users/me', auth, async (req, res) => {

    res.send(req.user)

})

router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if (!user || !user.avatar) {
            throw new Error()
        }

        res.set('Content-Type', 'image/png')

        res.send(user.avatar)
    } catch (error) {
        res.status(404).send()
    }
})

router.patch('/users/me', auth, async (req, res) => {
    // const _id = req.params.id
    const updates = Object.keys(req.body)
    const allowToUpdate = ['name', 'email', 'password', 'age']
    const isValidToUpdate = updates.every((update) => allowToUpdate.includes(update))

    if (!isValidToUpdate) {
        return res.status(400).send({ error: 'Invalid update!' })
    }

    try {

        // const user = await User.findById(_id)

        updates.forEach((update) => req.user[update] = req.body[update])

        await req.user.save()

        // const user = await User.findByIdAndUpdate(_id, req.body, {new: true, runValidators:true})
        // if (!user) {
        //     return res.status(404).send()
        // }
        res.send(req.user)
    } catch (error) {
        res.status(400).send(error)
    }
})

router.delete('/users/me', auth, async (req, res) => {
    // const _id = req.params.id
    try {

        await req.user.remove()
        res.send(req.user)

        // const user = await User.findByIdAndDelete(_id)
        // if(!user){
        //     return res.status(404).send()
        // }
        // res.send(user)
    } catch (error) {
        res.status(500).send()
    }
})

router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})

module.exports = router