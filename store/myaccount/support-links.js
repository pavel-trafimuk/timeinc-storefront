var FAQUrl=settings.myacctFAQURLR28;

function go(URL){
      window.location.href=URL;
 }
if (!(/CK|SM|EW/).test("{{MAG_CODE}}")) {
	FAQUrl=settings.myacctFAQURLR27;
}
if ((/TK/).test("{{MAG_CODE}}")) {
	FAQUrl="http://subscription-assets.timeinc.com/prod/assets/themes/magazines/SUBS/templates/velocity/site/tk-ipad-digitaledition-faq/lp.html";
}

document.write('<div class="care"><hr>'+settings.myacctCustomerCareSupport+'<p>');

if ("{{MAG_CODE}}" != "PP") {
	document.write('<a onclick="go(FAQUrl)" href="#" target="_blank" class="care-btn">' + settings.myacctFAQ + '</a>');
}
if (settings.customerServiceUrl && "{{MAG_CODE}}" != "TK") {
	    document.write('<a onclick="go(settings.customerServiceUrl)" href="#" target="_blank" class="care-btn">' + settings.myacctCustService + '</a>');
}
if (settings.signInForgotPasswordUrl && "{{MAG_CODE}}" != "TK") {
        document.write('<a onclick="go(settings.signInForgotPasswordUrl)" href="#" target="_blank" class="care-btn">' + settings.myacctForgotPassword + '</a>');
}
if (!(/SK|AY|HA|CT|PP|MO|IN|TH|FA|FI|FZ/).test("{{MAG_CODE}}")) {
	 	document.write('<a onclick="go(settings.myacctHelpGuideURL)" href="#" class="care-btn">'+settings.myacctHelpGuide+'</a>');
}
document.write('</p></div>');