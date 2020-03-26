class SampleApp extends (window['CotApp'] || window['CotApp']) {
  constructor() {
    super();
    this.$container = $('#donations_form');
    this.model = new CotModel({
      "donationItems":
        [{"name":"Toilet Paper","description":"I have 400 rolls to donate"}],
        "fullName":"Derek Matthew",
        "companyname":"My Ontario Company",
        "phone":"416-555-1234",
        "email":"derek.matthew@ontariocompany.co",
        "preferredContact":["Email"],
    });
  }

  render() {
    //@if !IS_EMBEDDED
    super.render(); //this function only exists in CotApp
    //@endif

    this.startRouter();

  }

  startRouter() {
    new (Backbone.Router.extend({
      routes: {
        "": () => {
          let form = new DonationsForm(this.$container);
          form.setModel(this.model);
          form.render();
        },
        "thank-you": () => {
          if(!this.model.toJSON().hasOwnProperty('fullName')) Backbone.history.navigate(``, { trigger: true });
          $.ajax({
            url:`/*@echo THANKYOU_PAGE*/`,
            success:(res)=>{
              document.querySelector('h1').innerText = `Thank You for Your Donation`
              this.$container.html(`${res} <p><small>/*@echo THANKYOU_PAGE*/</small></p> <hr /><p><strong>Payload:</strong><small>${JSON.stringify(this.model.toJSON())}</small></p>`)
            }
          })
        }
      }
    }))();
    Backbone.history.start();
  }
}
