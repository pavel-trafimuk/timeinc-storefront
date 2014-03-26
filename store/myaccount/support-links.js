var FAQUrl=settings.myacctFAQURLR28;

function go(URL){
      window.location.href=URL;
 }
if (!(/CK|SM|EW|TD|SL|FO|SK/).test("{{MAG_CODE}}")) { 
	FAQUrl=settings.myacctFAQURLR27;
}
if ((/TK/).test("{{MAG_CODE}}")) {
	FAQUrl="http://subscription-assets.timeinc.com/prod/assets/themes/magazines/SUBS/templates/velocity/site/tk-ipad-digitaledition-faq/lp.html";
}

document.write('<div class="care"><hr>'+settings.myacctCustomerCareSupport+'<p>');

if ("{{MAG_CODE}}" != "PP") {
	document.write('<a href="#" target="_blank" id="FAQs" class="care-btn">' + settings.myacctFAQ + '</a>');
}
if (settings.customerServiceUrl && !(/FI|FA|FZ|TI|TA|TZ|TK/).test("{{MAG_CODE}}")) {
	    document.write('<a href="#" id="customerService" target="_blank" class="care-btn">' + settings.myacctCustService + '</a>');
}
if (settings.signInForgotPasswordUrl && "{{MAG_CODE}}" != "TK") {
        document.write('<a href="#" id="forgotPassword" target="_blank" class="care-btn">' + settings.myacctForgotPassword + '</a>');
}
if (!(/SK|AY|HA|CT|PP|MO|TH|FA|FI|FZ/).test("{{MAG_CODE}}")) {
	 	document.write('<a href="#" id="helpGuide" class="care-btn">'+settings.myacctHelpGuide+'</a>');
}
document.write('</p></div>');
(function() {
      $("#FAQs").click(function(evt) {
          evt.preventDefault();
          myAccount.track_user_action("My Account| FAQs", "myaccount_taps_FAQs");
          setTimeout(function(){go(FAQUrl)},100);
       });
      $("#customerService").click(function(evt) {
          evt.preventDefault();
          myAccount.track_user_action("My Account| Customer Service", "myaccount_taps_customerService");
          setTimeout(function(){go(settings.customerServiceUrl);}, 100);
       });
      $("#forgotPassword").click(function(evt) {
          evt.preventDefault();
          myAccount.track_user_action("My Account| Forgot Password", "myaccount_taps_forgotPassword");
          setTimeout(function(){go(settings.signInForgotPasswordUrl);}, 100);
       });
      $("#helpGuide").click(function(evt) {
          evt.preventDefault();
          myAccount.track_user_action("My Account| Help Guide", "myaccount_taps_helpGuide");
          setTimeout(function(){go(settings.myacctHelpGuideURL);}, 100);
       });
       
 })();