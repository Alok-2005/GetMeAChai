import { PASSWORD_RESET_SUCCESS_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplates.js"
import { mailtrapClient } from "./mailtrap.config.js"
import { sender } from "./mailtrap.config.js"
import { PASSWORD_RESET_REQUEST_TEMPLATE } from "./emailTemplates.js"
export const sendVerificationEmail=async(email,verficationToken)=>{
const recipient=[{email}]

try{
const response=await mailtrapClient.send({
    from:sender,
    to:recipient,
    subject:"Verify Your Email",
    html:VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}",verficationToken),
    category:"Email Verification"
})
console.log("Email sent sucessfully",response);

}catch(error){
    console.error("Error sending verification email ",error)
throw new Error(`Error sending verification email: ${error}`)
}
}

export const sendWelcomeEmail=async(email,name)=>{
const recipient=[{email}]
try{
    const response=await mailtrapClient.send({
        from:sender,
        to:recipient,
        template_uuid:"5342eae2-978b-433d-9142-384f293b3e15",
        template_variables:{
            "name": name,
      "company_info_name": "Auth Company",
      "company_info_address": "Nigdi,Talawade",
      "company_info_city": "Pune",
      "company_info_zip_code": "411062",
      "company_info_country": "India"
        },
    })
    console.log("Welcome Email sent succssfully ",response);
    
}
catch(error){
    console.error(`Error sending welcome email`,error)
    throw new Error(`error sending email: ${error}`)
}
}

export const sendPasswordResetEmail=async(email,resetURL)=>{
    const recipient=[{email}]
    try{
        const response=await mailtrapClient.send({
            from:sender,
            to:recipient,
            subject:"Reset Your Password",
            html:PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}",resetURL),
            category:"Reset Password", 
        })
        
        console.log(response)
    }catch(error){
        console.error(`Error sending password reset email`,error);
        throw new Error(`Error sending password reset email ${error}`)
    }
}

export const sendResetSuccessEmail=async(email)=>{
const recipient=[{email}]
try {
    const response=await mailtrapClient.send({
        from:sender,
        to:recipient,
        subject:"Password reset successfull",
        html:PASSWORD_RESET_SUCCESS_TEMPLATE,
        category:"Password reset"
    })
    console.log("Password reset email sent successfully",response);
    
} catch (error) {
    console.error(`error sending password reset succes email`,error)
    throw new Error(`Error sending password reset success email: ${email}`)
}
}