const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendEmail = (email, name)=>{
    const msg = {
        to: email, // Change to your recipient
        from: 'mehedihasansarkar1899@gmail.com', // Change to your verified sender
        subject: 'Sending Email with NOdeJS',
        text: `Hello ${name},\nThis Email for testing purpose.`,
        // html: '<strong>and easy to do anywhere, even with Node.js</strong>'
      }
      sgMail
        .send(msg)
}

//   .then(() => {
//     console.log('Email sent')
//   })
//   .catch((error) => {
//     console.error(error.message)
//   })

module.exports = {
    sendEmail
}