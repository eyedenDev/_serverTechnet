const sendgrid = require('sendgrid'),
  helper = sendgrid.mail, // helper for snding email
  keys = require('../config/keys');


class Mailer extends helper.Mail {
  constructor({ subject, recipients},  content) {
    super();

    this.sgApi = sendgrid(keys.sendGridKey);
    this.from_email = new helper.Email('no-reply@freshsurvey.com');
    this.subject = subject;
    this.body =  new helper.Content('text/html', content);

    this.recipients = this.formatAddresses(recipients);

    // register body with mailer
    this.addContent(this.body);

    // enable click tracking
    this.addClickTracking();

    this.addRecipients();

  }
  // itterate through recipients and return destructured email address
  formatAddresses(recipients){
    return recipients.map(({email}) => {
      // format email b4 return
      return new helper.Email(email);
    });
  }

  addClickTracking() {
    const trackingSettings = new helper.TrackingSettings(),
      clickTracking = new helper.ClickTracking(true, true);
    trackingSettings.setClickTracking(clickTracking);
    this.addTrackingSettings(trackingSettings);
  }


  // register recipients
  addRecipients(){
    const personalize = new helper.Personalization();
    // itterate through recipients add to personal obj
    this.recipients.forEach(recipient => {
      personalize.addTo(recipient);
    });

    this.addPersonalization(personalize);
  }

  // send function
  async send() {
    const request = await this.sgApi. emptyRequest({
      method:'POST',
      path: '/v3/mail/send',
      body: this.toJSON()
    });
    this.sgApi.API(request);
  }
}

module.exports = Mailer;
