/*
 The gulpfile for WCM-embedded WRP web apps using the core library combined with bower and gulp.
 You shouldn't have to change this file much, but you could if you wanted.
 Note that this file uses es6 syntax.
 http://gulpjs.com/
 */

const gulp = require('gulp');
const core = require('./node_modules/core/gulp_helper');
const pkg = require('./package.json');

//You should pass options to the createTasks method below
let options = {
  pkg, //pass in the contents of package.json

  //How this app should be embedded in the simulator. Options are: 'full', 'left', or 'right'
  //This is optional, and the default value is 'full'
  //This only applies to apps where isEmbedded is true
  embedArea: 'full',

  //If you want to add vars to the preprocessor context, include this option
  //You can add environment-specific vars or general vars
  preprocessorContext: {
    DATA: '/c3api_data/v2/DataAccess.svc/covid19_donations/submissions',
    RECAPTCHA_SITEKEY:"6LeN_XIUAAAAAEd8X21vFtkJ3_c7uA0xpUGcrGpe",
    RECAPTCHA_API_URL:"/c3api_data/v2/DataAccess.svc/cot_dts_recaptcha/app_config/ca.toronto.api.dataaccess.odata4.verify",
    COT_RECAPTCHA_CONFIG_TOKEN:"f8034f92-a3e7-4878-9f5b-f6b4814b5728",
    local: {
      ROOT_ENV: 'https://was-intra-sit.toronto.ca',
      THANKYOU_PAGE: '/data/covid19_donations-thankyou.html'
    },
    dev: {
      ROOT_ENV: 'https://was-inter-sit.toronto.ca',
      THANKYOU_PAGE: '/app_content/covid19_donations-thankyou/'
    },
    qa: {
      ROOT_ENV: 'https://was-inter-qa.toronto.ca',
      THANKYOU_PAGE: '/app_content/covid19_donations-thankyou/'
    },
    prod: {
      ROOT_ENV: 'https://secure.toronto.ca',
      THANKYOU_PAGE: '/app_content/covid19_donations-thankyou/'
    }
  },

  //If you want to override the environment that the build process uses, specify it here
  //Valid values are: 'local', 'dev', 'qa', 'prod'
  //If you omit this (which you probably should), then the environment will be:
  //'local' when running or building on your machine
  //'dev' when calling gulp deploy:dev
  //'qa' when calling gulp deploy:qa
  //'prod' when calling gulp deploy:prod
  environmentOverride: null,

  //By default, standalone apps are built to deploy to /webapps/appname
  //BUT you can use this option to override that value. ex: /webapps/work/decom/appname
  //IMPORTANT!! this value should NOT end with a forward slash
  //This option has no effect on embedded apps, which are always deployed to /resources/app_name
  //The value used here will also be used for the SRC_PATH preprocessor var
  deploymentPath: null
};

//This creates several gulp tasks to use during development:
//default, clean, build, build_with_simulator, run, deploy:dev, deploy:qa, deploy:prod
core.embeddedApp.createTasks(gulp, options);


//Note that you can override any task that createTasks added, by redefining it after the call to createTasks
//ex:
// gulp.task('deploy:dev', ['_deploy_prep'], () => {
//   ...do some custom deploy code...
// });

//FAKING DATA AND CONFIG FILES:
gulp.task('_data', () => {
  let myDataPath = '/data'; //On S3, this will be something like /data/division/my_app
                            //On WP, this will be something different
  return gulp.src(['src/data/**/*']).pipe(gulp.dest('dist' + myDataPath));
});
