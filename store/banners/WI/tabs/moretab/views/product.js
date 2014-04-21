
Product = Backbone.Model.extend({});

ProductList = Backbone.Collection.extend({
	model: Product
});

HeroView = Backbone.View.extend({
	template: _.template($("#hero-template").html()),
	render: function() {
		var rendered = this.template(this.model.attributes);
		this.$el.html(rendered);
		return this;
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
		})
	}
});
DetailOverlayDialog = Backbone.View.extend({
	className: "dialog",
	template: _.template($("#overlay-template").html()),
	events: {
		"click .dod-close-button": "close"
	},
	render: function() {
		var cx = _.clone(this.model.attributes),
			product_id = this.model.get("productID"),
			link = this.model.get("link");
		
		if (product_id) {
			cx.buttonText = "Subscribe";
			cx.buttonClass = "subscribe";
		}
		else if (link) {
			cx.buttonText = "Open In App Store";
			cx.buttonClass = "appstore";
		}
		
		this.$el.html(this.template(cx));
		return this;
	},
	initialize: function() {
		this.render().$el.appendTo("body");
	},
	close: function() {
		// calling remove from here to allow for
		// a closing animation in the future
		this.remove();
	}
});