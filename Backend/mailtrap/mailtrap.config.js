import {MailtrapClient} from "mailtrap";
import dotenv from "dotenv";
dotenv.config();


const TOKEN ="6bfc4b5efe28755339eee04bee464acb";
const ENDPOINT="https://send.api.mailtrap.io";

// const TOKEN =process.env.MAILTRAP_TOKEN;
// const ENDPOINT=process.env.MAILTRAP_ENDPOINT;

// console.log("TOKEN:",TOKEN); // Debugging
// console.log("ENDPOINT:",ENDPOINT);


// export const mailtrapClient = new MailtrapClient({ endpoint: process.env.MAILTRAP_ENDPOINT,token: process.env.MAILTRAP_TOKEN,});

export const mailtrapClient = new MailtrapClient({ endpoint: ENDPOINT,token: TOKEN,});

export const sender = {
  email: "mailtrap@demomailtrap.com",
  name: "Alok Chaturvedi",
};
