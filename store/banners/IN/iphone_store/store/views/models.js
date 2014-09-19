/* global $, _, Backbone, sub_status */


/*
 * Models
 */
var Issue = Backbone.Model.extend({
	defaults: {
		viewable: false,
		purchasable: true,
		downloadable: false,
		price: "$4.99"
	},
	initialize: function(fields) {
		this.issue = fields.issue;
		this.set({
			productId: $(this.issue).attr("productId"),
			name: $("issueNumber", this.issue).text()
		});
		this.update_from_dps_api();
	},
	cover_url: function() {
		return libBanner.get_cover_url_for_issue(this.issue);
	},
	update_from_dps_api: function() {
		var self = this;
		libBanner.get_folio_by_product_id(this.get("productId"), function(folio) {
			if (!folio) return;
			self.set({
				viewable: folio.isViewable,
				purchasable: folio.isPurchasable,
				downloadable: folio.isDownloadable,
				price: folio.price
			});
		});
	},
	get_action_button_text: function() {
		if (this.get("viewable")) return "View";
		if (this.get("downloadable")) return "Download";
		if (this.get("purchasable")) return "Buy";
		return "Unavailable";
	}
});

IssueList = Backbone.Collection.extend({
	model: Issue
});



/*
 * Views
 */

HeroView = Backbone.View.extend({
	events: {
		"click": function() { return false },
	},
	template: _.template($("#hero-template").html()),
	render: function() {
		var that = this;
			cx = {issue: this.model};

		cx.is_subscriber = sub_status.is_sub;

		this.$el.html(this.template(cx));

		return this;
	},
	show_detail: function() {
		new DetailOverlayDialog({
			model: this.model
		});
	}
});

BackIssueView = Backbone.View.extend({
	className: "biv-container",
	events: {
		"tap": function(evt) { evt.preventDefault(); },
		"click": function() { return false },
		"tap .backissue-btn": "buy_or_view"
	},
	template: _.template($("#backissue-template").html()),
	initialize: function() {
		this.listenTo(this.model, "change", this.render);
	},
	render: function() {
		var that = this,
			cx = {issue: this.model};

		this.$el.html(this.template(cx));
		this.$el.attr("data-product-id", this.model.get("productId"));

		return this;
	},
	buy_or_view: function(evt) {
		new ProgressView();
		libBanner.buy_issue(this.model.get("productId"));
	},
	open_detail_dialog: function() {
		new DetailOverlayDialog({
			model: this.model
		});
	}
});

ProgressView = Backbone.View.extend({
	className: "progress-overlay",
	template: _.template("<div class='progress-box'>Opening…<% for (var i=6; i--;) { %><div class='progress-tick progress-tick-<%= i %>'></div><% } %></div>"),
	initialize: function() {
		var that = this;
		this.render();
		this.$el.appendTo("html");

		setTimeout(function() {
			that.$el.addClass("show");
			that.$(".progress-box").addClass("show");
		});
	},
	render: function() {
		var cx = {};
		return this.$el.html(this.template(cx))
	}
});
