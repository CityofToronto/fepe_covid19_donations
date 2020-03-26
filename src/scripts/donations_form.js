class DonationsForm {
  constructor(container) {
    this.model;
    this.container = container;
    this.cotForm = new CotForm(this.formDefinition());
  }

  render() {
    this.cotForm.setModel(this.model);
    this.cotForm.render({target: this.container});
  }

  setModel(model){
    this.model = model;
    this.cotForm.setModel(model);
  }

  formDefinition(){
    let formId = 'example_cot_form';
    return {
      id: formId, //required, a unique ID for this form
      title: 'COVID-19 Donations', //optional, a title to display at the top of the form
      rootPath: '/*@echo SRC_PATH*//', //optional, only required for forms using validationtype=Phone fields
      success: (event) => {
        event.preventDefault(); //this prevents the formvalidation library from auto-submitting if all fields pass validation
        
        let model = this.model;
        let data = model.toJSON();

        // $.ajax({
        //   url:'/*@echo ROOT_ENV*//*@echo DATA*/',
        //   method:'POST',
        //   dataType:'json',
        //   headers: {
        //     'Content-Type': 'application/json',
        //     //'captchaResponseToken':token,
        //     'cot_recaptcha_config':'/*@echo COT_RECAPTCHA_CONFIG_TOKEN*/'
        //   },
        //   data:JSON.stringify(data),
        //   error: function(xhr, status, error){
        //     $(".g-recaptcha").removeClass("disabled");
        //   }
        // }).then(res=>{
        //   this.model.set({'submission':res});
        //   Backbone.history.navigate(`thank-you`, { trigger: true });
        // })
    

      
        grecaptcha.ready(function() {
          grecaptcha.execute('/*@echo RECAPTCHA_SITEKEY*/').then(function(token) {
            $.ajax({
              url:'/*@echo ROOT_ENV*//*@echo RECAPTCHA_API_URL*/',
              method:'POST',
              dataType:'json',
              headers: {
                'Content-Type': 'application/json',
                'captchaResponseToken':token,
                'cot_recaptcha_config':'/*@echo COT_RECAPTCHA_CONFIG_TOKEN*/'
              },
              data:JSON.stringify(data),
              error: function(xhr, status, error){
                $(".g-recaptcha").removeClass("disabled");
              }
            }).then(res=>{
              model.set({'submission':res});
              Backbone.history.navigate(`thank-you`, { trigger: true });
            })
          })
        })

        return false;
      },
      useBinding: true,
      sections: [
        {
          id: "example_section_one",
          title: "",
          className: 'example-form-section panel-default',
          rows: [
            {
              fields: [
                {
                  id: 'name', //required, used to create the dom element id
                  title: 'Your Name',
                  type: 'text',
                  //posthelptext: 'An example of a text field',
                  className: 'col-xs-12 col-sm-8',
                  addclass: 'additional-class',
                  required: true,
                  requiredMessage: 'You must enter your name',
                  //infohelp: 'Your name likely consists of a first name and a surname (or last name). Some people may have more or less. Enter whatever you feel most comfortable with', //optional, help text for the field, which is shown via a tooltip for an info icon, does not apply to type=html||button
                  disabled: false,
                  placeholder: 'name',
                  htmlAttr: {maxLength:100},
                  bindTo:'fullName'
                },{
                  id: 'company-name',
                  title: 'If you are representing a Company please provide the business name', //required except for type=html|button|static, the title/label for the field
                  type: 'text',
                  //posthelptext: 'An example of a text field',
                  className: 'col-xs-12 col-sm-8',
                  addclass: 'additional-class',
                  required: false,
                  requiredMessage: 'You must enter your name at least!',
                  //infohelp: 'Your name likely consists of a first name and a surname (or last name). Some people may have more or less. Enter whatever you feel most comfortable with', //optional, help text for the field, which is shown via a tooltip for an info icon, does not apply to type=html||button
                  disabled: false, 
                  placeholder: 'Business Name',
                  htmlAttr: {maxLength:100},
                  bindTo:'companyname'
                }
              ]
            },{
              fields: [
                {
                  id: 'phone',
                  title: 'Phone Number',
                  type:'phone',
                  posthelptext: 'Ex: 416-123-1234', //optional, help text for the field which is always displayed, in front of the field
                  //posthelptext: 'An example of a text field automatic phone validation',
                  validationtype: 'Phone', //optional, enum: ['Phone', 'Email', 'URL','PostalCode'], if specified, this will automatically set the proper validators object
                  validationMessage: 'Phone numbers must be entered in a valid format', //optional, when validationtype is used or type is set to daterangepicker||datetimepicker, this can be specified to override the default error message
                  bindTo: 'phone'
                },
                {
                  id: 'email',
                  title: 'Email',
                  type:'email',
                  required: true,
                  //validationtype: 'Email',
                  posthelptext: 'Ex: you@me.com',
                  bindTo: 'email'
                }
              ]
            },{
              fields: [
                {
                  id: 'preferred-contact',
                  title: 'Preferred Contact',
                  type:'checkbox',
                  choices:[
                    {text:'Email'},
                    {text:'Phone'}
                  ],
                  validationMessage: 'Choose your preferred contact',
                  bindTo: 'preferredContact'
                },
              ]
            },{
              repeatControl: {
              id: 'donations',
              title: 'Items to Donate',
              className: 'col-md-12',
              initial: 1,
              min: 1,
              bindTo: 'donationItems',
              rows: [{
                  fields: [{
                      id: 'name',
                      title: 'Name',
                      required:true,
                      posthelptext: '',
                      bindTo: 'name',
                  }]
              },{
                fields: [{
                    id: 'description',
                    required:true,
                    type:'textarea',
                    title: 'Description',
                    prehelptext: 'Please be as descriptive as possible, include quantity and how quickly it can be made available',
                    bindTo: 'description'
                }]
            }]
           }
          }
          ]
        },{
          id: "section-submit",
          title: "",
          className: 'panel-default text-right',
          rows: [
            {
              fields: [
                {
                  id: 'submit_button',
                  type: 'button',
                  btnClass: 'primary btn-lg', //optional, only applies when type=button, defaults to 'success', determines the bootstrap btn-x class used to style the button, valid values are here: http://getbootstrap.com/css/#buttons-options
                  // glyphicon: 'glyphicon-thumbs-up',
                  title: 'Submit Donation',
                  onclick: function(){ //optional, when type=button this specifies an onclick function
                    $('#' + formId).data('formValidation').validate(); //attempt form submission, if validation is successful, the success event is called
                    return false;
                  }
                }
              ]
            }
          ]
        }
      ]
    };
  }
}
