const nodemailer = require('nodemailer');
const main = (emailAddress, subject, content)=>
{
        let transporter = nodemailer.createTransport({
            host:"smtp.outlook.com",
            port:587,
            secure:false,
            auth:{
                user:"your_mail_address",
                pass:"your_mail_password"
            }
        })

         transporter.sendMail({
            from: "your_mail_address", // sender address
            to: emailAddress, // list of receivers
            subject:subject, // Subject line
            html: content, // plain text body
          });
}

module.exports = main