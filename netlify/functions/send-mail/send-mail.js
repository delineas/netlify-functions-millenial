const nodemailer = require("nodemailer");

exports.handler = async function (event, context, callback) {
  console.log("event", JSON.parse(event.body));
  // Parse the JSON text received.
  const body = JSON.parse(event.body);

  // Build an HTML string to represent the body of the email to be sent.
  const html = `<div style="margin: 20px auto;">${body.body}</div>`;

  // Generate test SMTP service account from ethereal.email. Only needed if you
  // don't have a real mail account for testing
  let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass, // generated ethereal password
    },
  });

  try {
    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"La nube" <lanube@example.com>',
      to: body.email,
      subject: "Envio milenial",
      text: body.body,
      html: html,
    });
    // Log the result
    console.log(info);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    return { statusCode: 200, body: JSON.stringify(info) };
  } catch (error) {
    // Catch and log error.
    callback(error);
  }
};
