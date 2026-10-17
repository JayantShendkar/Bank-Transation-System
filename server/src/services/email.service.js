const nodemailer=require("nodemailer");
const transporter=nodemailer.createTransport({
    service:"gmail",
    auth:{
        type:"OAuth2",
        user:process.env.EMAIL_USER,
        clientId:process.env.CLIENT_ID,
        clientSecret:process.env.CLIENT_SECRET,
        refreshToken:process.env.REFRESH_TOKEN,
    }
});

transporter.verify(function(error,sucess){
    if(error){
        console.log("error connecting to email server:",error);
    } else{
        console.log("Email server is ready to send message")
    }
})

const sendEmail=async function(to,subject,text,html){
    try{
        const info=await transporter.sendMail({
            from:`"Backend-Ledger" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text,
            html,
        });
        console.log("Message sent: %s",info.messageId);
        console.log("Preview UURL: %s", nodemailer.getTestMessageUrl(info));
    } catch(error){
        console.log("Error sending email:",error)
    }
};

async function sendRegesterEmail(userEmail, name) {
    const subject = "Welcome to Backend-Ledger 👋";

    const text = `
    Hi ${name},

    You have successfully logged in to your account.

    If this was you, no action is needed.
    If you did not log in, please secure your account immediately.

    Happy to have you back!
    — The Team
    `;

    const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #4f46e5;">Welcome back, ${name}! 👋</h2>
        <p>You have successfully logged in to your account.</p>

        <p>
            <strong>Was this you?</strong><br/>
            If yes, you’re all set 🚀<br/>
            If not, we recommend changing your password immediately.
        </p>

        <p style="margin-top: 20px;">
            Thanks for being with us,<br/>
            <strong>The Team</strong>
        </p>

        <hr style="margin-top: 30px;" />
        <p style="font-size: 12px; color: #777;">
            This is an automated message. Please do not reply.
        </p>
    </div>
    `;

    await sendEmail(userEmail, subject, text, html);
}
async function sendTransactionEmail(userEmail,name,amount,toAccount){
    const subject = "Transaction Successful 💸";

    const text = `
    Hi ${name},

    Your transaction was completed successfully.

    Amount: ₹${amount}
    To Account: ${toAccount}

    If you did not authorize this transaction, please contact support immediately.

    — The Team
    `;

    const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #16a34a;">Transaction Successful 💸</h2>

        <p>Hi ${name},</p>

        <p>Your transaction has been completed successfully. Here are the details:</p>

        <ul>
            <li><strong>Amount:</strong> ₹${amount}</li>
            <li><strong>To Account:</strong> ${toAccount}</li>
        </ul>

        <p>
            If you recognize this transaction, no further action is needed ✅<br/>
            If not, please contact our support team immediately.
        </p>

        <p style="margin-top: 20px;">
            Thank you for using our service,<br/>
            <strong>The Team</strong>
        </p>

        <hr style="margin-top: 30px;" />
        <p style="font-size: 12px; color: #777;">
            This is an automated message. Please do not reply.
        </p>
    </div>
    `;

    await sendEmail(userEmail, subject, text, html);
}

async function sendTransactionFailureEmail(userEmail,name,amount,fromAccount){
    const subject = "Transaction Failed ⚠️";

    const text = `
    Hi ${name},

    Unfortunately, your transaction could not be completed.

    Amount: ₹${amount}
    From Account: ${fromAccount}

    No amount has been deducted from your account.

    Please try again or contact support if the issue persists.

    — The Team
    `;

    const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #dc2626;">Transaction Failed ⚠️</h2>

        <p>Hi ${name},</p>

        <p>We couldn’t process your transaction. Here are the details:</p>

        <ul>
            <li><strong>Amount:</strong> ₹${amount}</li>
            <li><strong>From Account:</strong> ${fromAccount}</li>
        </ul>

        <p style="color: #dc2626;">
            No money has been deducted from your account.
        </p>

        <p>
            You can try again later, or contact support if the issue continues.
        </p>

        <p style="margin-top: 20px;">
            We’re here to help,<br/>
            <strong>The Team</strong>
        </p>

        <hr style="margin-top: 30px;" />
        <p style="font-size: 12px; color: #777;">
            This is an automated message. Please do not reply.
        </p>
    </div>
    `;

    await sendEmail(userEmail, subject, text, html);
}

module.exports={
    sendRegesterEmail,
    sendTransactionEmail,
    sendTransactionFailureEmail
}