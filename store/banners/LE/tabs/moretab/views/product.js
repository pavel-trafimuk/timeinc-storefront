/* global $, _, Backbone, sub_status */
var Product, ProductList, HeroView, ProductView,
	DetailOverlayDialog, SubscribeDialog,
	libBanner;


Product = Backbone.Model.extend({});

ProductList = Backbone.Collection.extend({
	model: Product
});

HeroView = Backbone.View.extend({
	events: {
		"click": "show_detail"
	},
	template: _.template($("#hero-template").html()),
	render: function() {
		var cx = _.clone(this.model.attributes);
		this.$el.html(this.template(cx));
		return this;
	},
	show_detail: function() {
		new DetailOverlayDialog({
			model: this.model
		});
	}
});
ProductView = Backbone.View.extend({
	className: "pv-container",
	events: {
		"click": "open_detail_dialog"
	},
	template: _.template($("#product-template").html()),
	render: function() {
		var cx = _.clone(this.model.attributes);
		
		cx.title = this.model.get("title");
		cx.btn_text = this.model.get("price");

		this.$el.html(this.template(cx));
		return this;
	},
	open_detail_dialog: function() {
		new DetailOverlayDialog({
			model: this.model
		});
	}
});
DetailOverlayDialog = Backbone.View.extend({
	className: "dialog",
	template: _.template($("#overlay-template").html()),
	events: {
		"click .dod-button.appstore": "open_link",
		"click .dod-button.subscribe": "subscribe",
		"click .dod-button.download": "download",
		"click .dod-close-button": "close"
	},
	initialize: function() {
		var that = this;
		this.render().$el.appendTo("body");
		this.listenTo(Backbone, "subscriptionStatusUpdated", function() {
			that.render();
		});
	},
	render: function() {
		var cx = _.clone(this.model.attributes),
			product_id = this.model.get("productID");
		
		cx.buttonHref = "#";
		cx.buttonText = "Unavailable";
		cx.buttonClass = "unavailable";
		
		if (product_id) {
			cx.buttonText = this.model.get("price");
			cx.buttonClass = "buy";

			try {
				var folio = libBanner.api.libraryService.folioMap.getByProductId(product_id);
				if (folio.isDownloadable) {
					cx.buttonText = "Download";
					cx.buttonClass = "download";
				}
				else if (folio.isViewable) {
					cx.buttonText = "View";
					cx.buttonClass = "view";
				}
			} 
			catch (err) {}
		}
		
		this.$el.html(this.template(cx));
		return this;
	},
	download: function() {
		libBanner.buy_issue(this.model.get("productID"));
	},
	close: function() {
		// calling remove from here to allow for
		// a closing animation in the future
		this.remove();
	}
});