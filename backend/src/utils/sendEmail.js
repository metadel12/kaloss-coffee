exports.sendEmail = async ({ to, subject, message }) => {
    console.log(`Sending email to ${to}: ${subject}`);
    console.log(message);
};
