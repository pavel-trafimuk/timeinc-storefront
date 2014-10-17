/* global $, _, Backbone, sub_status */



/*
********************  Models  ********************
*/
var Issue = Backbone.Model.extend({
	defaults: {
		viewable: false,
		purchasable: true,
		downloadable: false,
		price: "",
		filter: "",
		detail_covers: []
	},
	initialize: function(fields) {
		// issue is the entry in the DPS xml feed for this folio
		// same as folio.adb in ApiWrapper
		this.issue = fields.issue;
		this.set({
			productId: $(this.issue).attr("productId"),
			name: $("issueNumber", this.issue).text(),
			filter: $("filter", this.issue).text(),
			description: $("description", this.issue).text()
		});
		this.update_from_dps_api();
		this.update_from_tcm_data();
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
				price: folio.price,

			});
		});
	},
	update_from_tcm_data: function() {
		var self = this;
		libBanner.get_tcm_data_for_product_id(this.get("productId"), function(tcm_data) {
			if (!tcm_data) return;

			self.set({
				detail_covers: tcm_data.additional_covers_lg || []
			});
		});
	},
	buy_or_view: function() {
		var progview = new libUI.ProgressView();
		libBanner.buy_issue(this.get("productId"), {
			cancelled: function() {
				progview.close();
			},
			errored: function(transaction) {
				new libUI.ErrorDialog({transaction: transaction});
			}
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
********************  Views  ********************
*/
HeroView = Backbone.View.extend({
	events: {
		"tap": function(evt) { evt.preventDefault() },
		"click": function(evt) { evt.preventDefault() },
		"tap .hero-cover": "show_detail",
		"tap .hero-preview-btn": "open_preview",
		"tap .hero-subscribe-btn": "show_subscribe_dialog",
		"tap .hero-buy-btn": "buy_or_view",
		"tap .hero-privacy": "show_legal"
	},
	template: _.template($("#hero-template").html()),
	initialize: function() {
		var self = this,
			preview_productid = settings.preview_issue_product_ids.iPhone;

		this.listenTo(this.model, "change", this.render);
		this.listenTo(Backbone, "subscriptionStatusUpdated", this.render);

		libBanner.get_folio_by_product_id(preview_productid, function(folio) {		
			if (!folio) return;

			libBanner.get_dps_data_for_product_id(preview_productid, function(issue) {
				self.model.set("show_preview_button", folio ? true : false);
				self.preview_issue = new Issue({issue: issue});
			});
		});
	},
	render: function() {
		var that = this;
			cx = {issue: this.model};

		cx.is_subscriber = sub_status.is_sub;

		this.$el.html(this.template(cx));

		return this;
	},
	open_preview: function(evt) {
		this.preview_issue.buy_or_view();
	},
	buy_or_view: function(evt) {
		var progview = new libUI.ProgressView();
		libBanner.buy_issue(this.model.get("productId"), {
			cancelled: function() {
				progview.close();
			},
			errored: function(transaction) {
				new libUI.ErrorDialog({transaction: transaction});
			}
		});
	},
	show_subscribe_dialog: function() {
		new libUI.SubscribeDialog();
	},
	show_detail: function() {
		new DetailView({
			model: this.model
		});
	},
	show_legal: function() {
	  libBanner.open(settings.privacyPolicyUrl);
	}
});


BackIssueView = Backbone.View.extend({
	className: "biv-container",
	events: {
		"tap": function(evt) { evt.preventDefault() },
		"click": function(evt) { evt.preventDefault() },
		"tap .backissue-btn": "buy_or_view",
		"tap .backissue-cover": "show_detail"
	},
	template: _.template($("#backissue-template").html()),
	initialize: function() {
		this.listenTo(this.model, "change", this.render);
		this.listenTo(Backbone, "subscriptionStatusUpdated", this.render);
	},
	render: function() {
		var that = this,
			cx = {issue: this.model};

		this.$el.html(this.template(cx));
		this.$el.attr("data-product-id", this.model.get("productId"));

		return this;
	},
	buy_or_view: function(evt) {
		this.model.buy_or_view();
	},
	show_detail: function() {
		new DetailView({
			model: this.model
		});
	},
	apply_filter: function(filter) {
		if (filter == "[all]") return this.$el.show();
		
		if (this.model.get("filter") == filter) {
			this.$el.show();
		}
		else {
			this.$el.hide();
		}
	}
});


FilterView = Backbone.View.extend({
	events: {
		"tap": function(evt) { evt.preventDefault() },
		"click": function(evt) { evt.preventDefault() },
		"tap a": "change_filter"
	},
	initialize: function() {
	  this.onload_filter();
	},
	onload_filter: function() {
	  var $li = $("li").first(),
      filter = $li.data("filter");
      
    this.apply_filter(filter);
	},
	change_filter: function(evt) {
		var $li = $(evt.currentTarget).closest("li"),
			filter = $li.data("filter");

		if ($li.is(".active")) return;

		this.$(".active").removeClass("active");
		$li.addClass("active");

		this.apply_filter(filter);
	},
	apply_filter: function(filter) {
		this.options.issues.forEach(function(issueView) {
			setTimeout(function() {
				issueView.apply_filter(filter);
			});
		});
	}
});


DetailView = Backbone.View.extend({
	className: "detail-overlay",
	template: _.template($("#detail-template").html()),
	events: {
		"tap .detail-close-btn": "close",
		"tap .detail-subscribe-btn": "show_subscribe",
		"tap .detail-buy-btn": "buy_or_view",
		"swipedown": "close",
		"touchmove": function(evt) { evt.stopPropagation(); evt.preventDefault(); }
	},
	initialize: function() {
		var that = this;

		this.render();
		this.$el.appendTo("html");

		setTimeout(function() {
			that.$el.addClass("show");
		});
	},
	render: function() {
		var cx = {
			cover_urls: [this.model.cover_url()].concat(this.model.get("detail_covers")),
			issue: this.model
		};
		this.$el.html(this.template(cx));
	},
	close: function() {
		var that = this;

		that.$el.removeClass("show");
		setTimeout(function() {
			that.remove();
		}, 300);
    },
    show_subscribe: function() {
    	new libUI.SubscribeDialog();
    },
    buy_or_view: function() {
	    this.model.buy_or_view();
	}
});