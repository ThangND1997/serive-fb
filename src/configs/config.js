import * as dotEnv from "dotenv";
dotEnv.config();

const ownerMailer = {
    user: "system.betiu.app@gmail.com",
    user: process.env.USER_ID_MAILER,
    password: process.env.PASSWORD_MAILER
};

const inforMailer = {
    from: "admin@betiu.app",
    subject: "Verify account your email"
}
export {ownerMailer, inforMailer};