var BuildView = Backbone.View.extend({
    
  tagName: 'div',
  className: 'pane build_details',

  initialize: function () {
    _.bindAll(this);
    this.model.bind("change:output", this.render);
  },

  render: function () {
    this.el = $(this.el);
    var tmpl = $(_.template($("#build_view_template").html(), {
          label: this.model.get("label"),
          output: this.parseOutput(),
          branch: this.model.get("branch")
        })),
        outputNode;

    tmpl.find(".build_result").addClass(this.model.status());

    this.el.html(tmpl);

    $(".pane.build_details").remove();
    $(".pane").append(this.el);

    outputNode = this.el.find(".build_output");

    outputNode.prop({ scrollTop: outputNode.prop("scrollHeight") });

    return this;
  },
  
  parseOutput: function() {
    var red = [], //["failure", "fail", "fatal", "error", "uncaught", "err"],
        green = ["✓"], //, "success", "successful"],
        output;

    output = this.model.get("output").replace(/\n/g,'<br>').replace(/\033\[[0-9;]*m/g,"");

    _.each(red, function (r) {
      output = output.replace(new RegExp(r, "i", "g"), "<span class='red'>" + r + "</span>");
    });

    _.each(green, function (g) {
      output = output.replace(new RegExp(g, "i", "g"), "<span class='green'>" + g + "</span>");
    });

    return output;
  }

});
