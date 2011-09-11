D.PopoverNav = Backbone.View.extend({
  tagName: 'div',
  className: 'popover_nav',

  events: {
    "clickoutside": "hide"
  },

  initialize: function (options) {
    this.items = options.items;
  },

  render: function () {
    var ul = $("<ul class='unstyled'>");

    _.each(this.items, function (item) {
      var li = $("<li>");
      li.html(item);
      ul.append(li);
    });
    
    $(this.el).html(ul);
    $(this.el).hide();

    return this;
  },

  show: function () {
    $(this.el).fadeIn(200);
  },

  hide: function () {
    $(this.el).fadeOut(200, function () {
      $(this).remove();
    });
  }

});
