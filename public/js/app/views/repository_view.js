var RepositoryView = Backbone.View.extend({

  tagName: 'div',
  className: 'pane',

  events: {
    'click #show_add_new_repo' : 'showAdd'
  },

  initialize: function (options) {
    _.bindAll(this);
    this.model.bind("change", this.render);
    this.selectedBuild = options.selectedBuild;
  },

  render: function () {
    var el = $(".pane"),
        frag = $(_.template($("#repository_show_template").html(), {name: this.model.get("name")}));

    frag.find(".build_result").addClass(this.model.status());

    if (el.length === 0) {
      el = this.el = $(this.el);
    }

    el.html(frag);

    if (this.model.get('buildList')) { 
      el.append(new BuildListView({
        collection: this.model.get("buildList"),
        selectedBuild: this.selectedBuild
      }).render().el);
    }
    else {
      el.append("This repository has no builds yet ☹");
    }

    return this;
  },
  
  showAdd: function() {
    appRouter.navigate("/repositories/new", true);
  }

});
