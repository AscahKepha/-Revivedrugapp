import nodemailer from "nodemailer"
import dotenv from "dotenv";

dotenv.config();

//transporter
// const transporter = nodemailer.createTranport({
//     service: "gmail",
//     host: "smtp.gmail.com",
//     secure: "true",
//     auth:{
//         user: process.env.EMAIL_SENDER,
//         pass: process.env.EMAIL_PASSWORD
//     }
// });

export const sendNotificationEmail = async(email:string, subject:string, userName:string, message:string) =>{
    try{
    const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    secure: true,
    auth:{
        user: process.env.EMAIL_SENDER,//we are passing the email address from the environment variable to hide credentials
        pass: process.env.EMAIL_PASSWORD
    }
});
const mailOptions = {
    from: `Drug Revive ${process.env.EMAIL_SENDER}`,
    to: email,
    subject: subject,
    text: `Hey ${userName}, ${message}\n`,
    html: `<html>
    <head>
    <style>
    .email-container{
    backgroundcolor}</style>
    </head>
    <body>
    <div className="email-container">
    <h2>${subject}</h2>
    <p>Hello,Hey, ${userName}, ${message}</p>
    <p>Drug Revive your wellness our priority</p>
    </div>
    </body>
    </html>`,
}
const mailResponse = await transporter.sendMail(mailOptions);

if(mailResponse.accepted.length > 0){
    return "Notification email sent successfully"
}else if (mailResponse.rejected.length > 0){
    return "Failed to send notification email, try again"
}else{
    return "Email server error"
}
    }catch(error){
        return "Email server error"
    }
}