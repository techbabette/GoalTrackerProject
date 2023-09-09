const BaseService = require("./BaseService");
let NodeMailer = require("nodemailer");

class EmailService extends BaseService{
    static transporter = NodeMailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });
    static async sendActivationEmail(activationHash, email, username){
        let activationLink = `${process.env.ACTIVATION_URL}${activationHash}`; 
        let mail = {
            from: "GoalTracker@gmail.com",
            to: email,
            subject: "Your GoalTracker activation link",
            html: `<h1>Welcome to GoalTracker ${username}</h1><a href="${activationLink}">Click me to activate your account!</a>`
        };
        await this.transporter.sendMail(mail);
    }
    static async sendPasswordResetEmail(passwordHash, email, username){
        let resetLink = `${process.env.RESET_URL}${passwordHash}`;
        let mail = {
            from: "GoalTracker@gmail.com",
            to: email,
            subject: "Your GoalTracker password reset link",
            html: `<h1>Welcome back to GoalTracker ${username}</h1><a href="${resetLink}">Click me to reset your password!</a>`
        }
        await this.transporter.sendMail(mail);
    }
}

module.exports = EmailService;