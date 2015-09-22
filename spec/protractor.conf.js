exports.config = {
  //seleniumAddress: 'http://localhost:4444/wd/hub',
  baseUrl: 'http://localhost:8080/app/',
  specs: ['e2e/*Spec.js'],
  multiCapabilities: [
    {browserName: 'firefox'},
    {browserName: 'chrome'}
  ],
  framework: 'jasmine2',
  onPrepare: function() {
    var jasmineReporters = require('jasmine-reporters');
 
    // returning the promise makes protractor wait for the reporter config before executing tests 
    return browser.getProcessedConfig().then(function(config) {
        // you could use other properties here if you want, such as platform and version 
        var browserName = config.capabilities.browserName;
 
        var junitReporter = new jasmineReporters.JUnitXmlReporter({
              consolidateAll: true,
              savePath: 'spec/e2e/results',
              filePrefix: browserName/*,
              modifySuiteName: function(generatedSuiteName, suite) {
                // this will produce distinct suite names for each capability, 
                // e.g. ‘firefox.login tests’ and ‘chrome.login tests’ 
                return browserName + ‘.’ + generatedSuiteName;
              }*/
            });
        jasmine.getEnv().addReporter(junitReporter);
    });
  }
}