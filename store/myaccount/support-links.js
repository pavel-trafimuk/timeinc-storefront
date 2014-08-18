(function() {

  var FAQUrl = settings.myacctFAQURLR28;

  function escapeHTML(s) {
      return s.split('&').join('&amp;').split('<').join('&lt;').split('"').join('&quot;');
  }
  function qualifyURL(url) {
      var el= document.createElement('div');
      el.innerHTML= '<a href="'+escapeHTML(url)+'">x</a>';
      return el.firstChild.href;
  }

  function go(URL){
    URL = qualifyURL(URL);
    
    setTimeout(function() {
      if (window.adobeDPS && adobeDPS.dialogService && adobeDPS.dialogService.open) {
        adobeDPS.dialogService.open(URL);
      }
      else {
        window.location.href = URL;
      }
    }, 100);
  }

  if (!(/CK|SM|EW|TD|SL|FO|SK/).test("{{MAG_CODE}}")) {
    FAQUrl = settings.myacctFAQURLR27;
  }
  if ((/TK/).test("{{MAG_CODE}}")) {
    FAQUrl = "http://subscription-assets.timeinc.com/prod/assets/themes/magazines/SUBS/templates/velocity/site/tk-ipad-digitaledition-faq/lp.html";
  }


  document.write('<div class="care" id="careButtons"><hr>'+settings.myacctCustomerCareSupport+'<p>');
    if ("{{MAG_CODE}}" != "PP") {
      document.write('<a href="#" target="_blank" id="FAQs" class="care-btn">' + settings.myacctFAQ + '</a>');
    }
    if (settings.customerServiceUrl && !(/FI|FA|FZ|TI|TA|TZ|TK/).test("{{MAG_CODE}}")) {
      document.write('<a href="#" id="customerService" target="_blank" class="care-btn">' + settings.myacctCustService + '</a>');
    }
    if (settings.signInForgotPasswordUrl && "{{MAG_CODE}}" != "TK") {
      document.write('<a href="#" id="forgotPassword" target="_blank" class="care-btn">' + settings.myacctForgotPassword + '</a>');
    }
    if (!(/SK|AY|HA|CT|PP|MO|TH|FA|FI|FZ|WI|LE/).test("{{MAG_CODE}}")) {
      document.write('<a href="#" id="helpGuide" class="care-btn">'+settings.myacctHelpGuide+'</a>');
    }
  document.write('</p></div>');
  


  $("#FAQs").click(function(evt) {
    evt.preventDefault();
    myAccount.track_user_action("My Account| FAQs", "myaccount_taps_FAQs");
    go(FAQUrl);
  });
  $("#customerService").click(function(evt) {
    evt.preventDefault();
    myAccount.track_user_action("My Account| Customer Service", "myaccount_taps_customerService");
    go(settings.customerServiceUrl);
  });
  $("#forgotPassword").click(function(evt) {
    evt.preventDefault();
    myAccount.track_user_action("My Account| Forgot Password", "myaccount_taps_forgotPassword");
    go(settings.signInForgotPasswordUrl);
  });
  $("#helpGuide").click(function(evt) {
    evt.preventDefault();
    myAccount.track_user_action("My Account| Help Guide", "myaccount_taps_helpGuide");
    go(settings.myacctHelpGuideURL);
  });
         
})();