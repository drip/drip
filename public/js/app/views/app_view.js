D.AppView = Backbone.View.extend({

  tagName: 'div',
  className: 'clearfix repositories',

  render: function () {
    var tmpl = _.template($("#repository_list_template").html());

    this.el = $(this.el);
    this.el.html(tmpl);

    $("#main_content").html(this.el);

    return this;
  }

});
