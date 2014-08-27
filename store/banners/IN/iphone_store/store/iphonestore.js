/* global $, Backbone, libBanner, Product, ProductList, HeroView, ProductView */
(function() {
  $(document).hammer();
  
  libBanner.track_page_view("iPhone Store");
  libBanner.echo();
  
  // Check if the user is a subscriber ASAP
  //   when cached data is avilable, use that while checking for fresh data
  window.sub_status = JSON.parse(localStorage.isSubscriberData || "{}");
  libBanner.get_subscription_status(function(status) {
    window.sub_status = status;
    localStorage.isSubscriberData = JSON.stringify(status);
    Backbone.trigger("subscriptionStatusUpdated", status);

    var $fc = $(".free-content");
    $fc[status.is_sub ? "removeClass" : "addClass"]("disabled");
  });



  // Setup the store
  libBanner.get_sorted_issues(function(issue_data) {
    issue_data = issue_data.map(function(issue) { return {issue: issue} });

    var feature = new Issue(issue_data[0]),
        back_issues = new IssueList(issue_data.slice(1));

    window.feature = feature;

    new HeroView({
      el: ".hero-container",
      model: feature
    }).render();

    var $backissues = $(".backissues-container");
    back_issues.each(function(issue) {
      new BackIssueView({
        model: issue,
      }).render().$el.appendTo($backissues);
    });
  });

})();