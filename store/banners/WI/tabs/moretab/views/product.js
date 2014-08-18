/* global $, _, Backbone, sub_status */
var Product, ProductList, HeroView, ProductView,
	DetailOverlayDialog, SubscribeDialog,
	libBanner;

Product = Backbone.Model.extend({
	is_ebook: function() {
		return !!this.get("link");
	}
});

ProductList = Backbone.Collection.extend({
	model: Product
});

HeroView = Backbone.View.extend({
	events: {
		
	},
	template: _.template($("#hero-template").html()),
	render: function() {
		var cx = _.clone(this.model.attributes);
		cx.buylink = this.model.get("link");
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
ProductView = Backbone.View.extend({
	className: "pv-container",
	events: {
		"click": "open_detail_dialog"
	},
	template: _.template($("#product-template").html()),
	render: function() {
		var rendered = this.template(this.model.attributes);
		this.$el.html(rendered);
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
		"click .dod-button.view": "view",
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
			product_id = this.model.get("productID"),
			link = this.model.get("link");
		
		cx.buttonHref = "#";

		try {
			var folio = libBanner.api.libraryService.folioMap.getByProductId(product_id);
		} 
		catch (err) {}
		
		if (product_id && folio && folio.isViewable) {
			cx.buttonText = "View";
			cx.buttonClass = "view";
		}
		else if (product_id && !sub_status.is_sub) {
			cx.buttonText = "Subscribe";
			cx.buttonClass = "subscribe";
		}
		else if (product_id) {
			cx.buttonText = "Download";
			cx.buttonClass = "download";
		}
		else if (this.model.is_ebook()) {
			cx.buttonText = "Open In App Store";
			cx.buttonClass = "appstore";
			cx.buttonHref = link;
		}
		
		this.$el.html(this.template(cx));
		return this;
	},
	open_link: function() {
		// var link = this.model.get("link");
		// link = encodeURIComponent(link);
		// location.href = link;
	},
	subscribe: function(evt) {
		evt.preventDefault();
		var $btn = this.$(".dod-button");
		
		$btn.fadeTo(500, 0.3);

		new SubscribeDialog({
			onclose: function() {
				$btn.fadeTo(50, 1.0);
			}
		});
	},
	download: function() {
		var $btn = this.$(".dod-button");
		
		$btn.fadeTo(500, 0.3);
		setTimeout(function() { $btn.fadeTo(2000, 0.3) }, 3000);
		
		libBanner.buy_issue(this.model.get("productID"));
	},
	view: function() {
		var $btn = this.$(".dod-button");
		
		$btn.fadeTo(500, 0.3);
		
		libBanner.buy_issue(this.model.get("productID"));
	},
	close: function() {
		// calling remove from here to allow for
		// a closing animation in the future
		this.remove();
	}
});

SubscribeDialog = Backbone.View.extend({
    className: "dialog",
    template: _.template($("#subscribe-dialog-template").html()),
    events: {
        "click .sd-close-button": "close",
        "click .sd-subscribe-button": "onSubscribe"
    },
    initialize: function() {
        this.render().$el.appendTo("body");
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
