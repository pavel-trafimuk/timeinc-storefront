/* global $, _, Backbone, sub_status */


/*
 * Models
 */
var Issue = Backbone.Model.extend({
	defaults: {
		viewable: false,
		purchasable: true,
		downloadable: false,
		price: "",
		preview_product_id: "",
		preview_dossier_id: "",
		show_preview_button: false
	},
	initialize: function(fields) {
		// issue is the entry in the DPS xml feed for this folio
		// same as folio.adb in ApiWrapper
		this.issue = fields.issue;
		this.set({
			productId: $(this.issue).attr("productId"),
			name: $("issueNumber", this.issue).text()
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
 * Views
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
		var progview = new ProgressView();
		libBanner.get_tcm_data_for_product_id(this.model.get("productId"), function(tcm_data) {
			if (!tcm_data.preview_button_product_id) return;

			var pid = tcm_data.preview_button_product_id,
				did = tcm_data.preview_button_dossier_id;

			libBanner.buy_issue(pid, did, {
				cancelled: function() {
					progview.remove();
				}
			});
		});
	},
	buy_or_view: function(evt) {
		var progview = new ProgressView();
		libBanner.buy_issue(this.model.get("productId"), {
			cancelled: function() {
				progview.remove();
			}
		});
	},
	show_subscribe_dialog: function() {
		new SubscribeDialog();
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
		var progview = new ProgressView();
		libBanner.buy_issue(this.model.get("productId"), {
			cancelled: function() {
				progview.remove();
			}
		});
	},
	open_detail_dialog: function() {
		new DetailOverlayDialog({
			model: this.model
		});
	}
});

ProgressView = Backbone.View.extend({
	className: "modal-overlay",
	template: _.template("<div class='progress-box modal-box'>Opening…<% for (var i=6; i--;) { %><div class='progress-tick progress-tick-<%= i %>'></div><% } %></div>"),
	events: {
    	"tap": function(evt) { evt.preventDefault() },
    	"touchmove": function(evt) { evt.preventDefault() },
		"click": function(evt) { evt.preventDefault() }
	},
	initialize: function() {
		var that = this;
		this.render();
		this.$el.appendTo("html");

		setTimeout(function() {
			that.$el.addClass("show");
			that.$(".modal-box").addClass("show");
		});
	},
	render: function() {
		var cx = {};
		return this.$el.html(this.template(cx))
	}
});

SubscribeDialog = Backbone.View.extend({
    className: "modal-overlay",
    template: _.template($("#subscribe-dialog-template").html()),
    events: {
    	"tap": function(evt) { evt.preventDefault() },
    	"touchmove": function(evt) { evt.preventDefault() },
		"click": function(evt) { evt.preventDefault() },
        "tap .sd-close-button": "close",
        "tap .sd-subscribe-button": "onSubscribe"
    },
    initialize: function() {
    	var that = this;

    	libBanner.api_ready(function() {
    		that.render()
    		that.$el.appendTo("html");
    		setTimeout(function() {
				that.$el.addClass("show");
				that.$(".modal-box").addClass("show");
			});
    	});
	},
	render: function() {
		var cx = {
			subscriptions: _(libBanner.api.receiptService.availableSubscriptions).values()
		}
		this.$el.html(this.template(cx));
		return this;
	},
    close: function() {
        this.remove();
    },
    onSubscribe: function(evt) {
        evt.preventDefault();
    
        var productId = $(evt.currentTarget).attr("id");
        var subscription = libBanner.api.receiptService.availableSubscriptions[productId];
        var transaction = subscription.purchase();
    
        transaction.completedSignal.addOnce(function(transaction) {
            var success = (transaction.state == libBanner.api.transactionManager.transactionStates.FINISHED);
            if (success) {
                sub_status.is_sub = true;
                sub_status.sub_type = "itunes";
                Backbone.trigger("subscriptionStatusUpdated", sub_status);
            }
        });
    	
    	this.remove();

    	if (this.options.onclose) this.options.onclose();
    }
});