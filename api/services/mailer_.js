const nodemailer = require('nodemailer'),
  CONFIG = require('../config/config'),
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: CONFIG.send_mail,
      pass: CONFIG.send_pass
    }
  }),
  EmailTemplate = require('email-templates').EmailTemplate,
  path = require('path'),
  Promise = require('bluebird');

// sends email
function sendEmail(obj) {
  return transporter.sendMail(obj);
}

// load temapltes
function loadTemplate(templateName, contexts) {
  let template = new EmailTemplate(
    path.join(
      __dirname,
      '../../../views/partials/content/emailTemplates',
      templateName
    )
  );
  return Promise.all(
    contexts.map(context => {
      return new Promise((resolve, reject) => {
        template.render(context, (err, result) => {
          if (err) reject(err);
          else
            resolve({
              email: result,
              context
            });
        });
      });
    })
  );
}
module.exports.sendEmail = sendEmail;
module.exports.loadTemplate = loadTemplate;
