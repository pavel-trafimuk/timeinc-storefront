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
		preview_product_id: "",
		preview_dossier_id: "",
		show_preview_button: false,
		filter: ""
	},
	initialize: function(fields) {
		// issue is the entry in the DPS xml feed for this folio
		// same as folio.adb in ApiWrapper
		this.issue = fields.issue;
		this.set({
			productId: $(this.issue).attr("productId"),
			name: $("issueNumber", this.issue).text(),
			filter: $("filter", this.issue).text()
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
				price: folio.price
			});
		});
	},
	update_from_tcm_data: function() {
		var self = this;
		libBanner.get_tcm_data_for_product_id(this.get("productId"), function(tcm_data) {
			if (!tcm_data) return;

			var pid = tcm_data.preview_button_product_id;

			self.set({
				preview_product_id: pid,
				preview_dossier_id: tcm_data.preview_button_dossier_id
			});

			libBanner.get_folio_by_product_id(pid, function(folio) {
				self.set("show_preview_button", folio ? true : false);
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
********************  Views  ********************
*/
HeroView = Backbone.View.extend({
	events: {
		"tap": function(evt) { evt.preventDefault() },
		"click": function(evt) { evt.preventDefault() },
		"tap .hero-preview-btn": "open_preview",
		"tap .hero-subscribe-btn": "show_subscribe_dialog",
		"tap .hero-buy-btn": "buy_or_view"
	},
	template: _.template($("#hero-template").html()),
	initialize: function() {
		this.listenTo(this.model, "change", this.render);
		this.listenTo(Backbone, "subscriptionStatusUpdated", this.render);
	},
	render: function() {
		var that = this;
			cx = {issue: this.model};

		cx.is_subscriber = sub_status.is_sub;

		this.$el.html(this.template(cx));

		return this;
	},
	open_preview: function(evt) {
		var progview = new libUI.ProgressView();
		libBanner.get_tcm_data_for_product_id(this.model.get("productId"), function(tcm_data) {
			if (!tcm_data.preview_button_product_id) return;

			var pid = tcm_data.preview_button_product_id,
				did = tcm_data.preview_button_dossier_id;

			libBanner.buy_issue(pid, did, {
				cancelled: function() {
					progview.remove();
				},
				errored: function(transaction) {
					new libUI.ErrorDialog({transaction: transaction});
				}
			});
		});
	},
	buy_or_view: function(evt) {
		var progview = new libUI.ProgressView();
		libBanner.buy_issue(this.model.get("productId"), {
			cancelled: function() {
				progview.remove();
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
		new DetailOverlayDialog({
			model: this.model
		});
	}
});


BackIssueView = Backbone.View.extend({
	className: "biv-container",
	events: {
		"tap": function(evt) { evt.preventDefault() },
		"click": function(evt) { evt.preventDefault() },
		"tap .backissue-btn": "buy_or_view"
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
		var progview = new libUI.ProgressView();
		libBanner.buy_issue(this.model.get("productId"), {
			cancelled: function() {
				progview.remove();
			},
			errored: function(transaction) {
				new libUI.ErrorDialog({transaction: transaction});
			}
		});
	},
	open_detail_dialog: function() {
		new DetailOverlayDialog({
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
	change_filter: function(evt) {
		var $li = $(evt.currentTarget).closest("li"),
			filter = $li.data("filter");

		this.$(".active").removeClass("active");
		$li.addClass("active");

		this.apply_filter(filter);
	},
	apply_filter: function(filter) {
		this.options.issues.forEach(function(issueView) {
			issueView.apply_filter(filter);
		});
	}
});