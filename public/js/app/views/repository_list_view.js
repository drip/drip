D.RepositoryListView = Backbone.View.extend({

  initialize: function (options) {
    _.bindAll(this);
    this.collection.bind("reset", this.render);
    this.collection.bind("add", this.add);
    this.selected = options.selected;
  },

  render: function () {
    var innerNode = $(".repositories").find(".repository_list ul"),
        list = this,
        groups = this.collection.groupBy(function (r) {
          return r.get("ownerName");
        });

    _.each(groups, function (repositories, ownerName) {
      innerNode.append("<li class='clearfix owner_name' id='owner_" + ownerName + "'><span class='user_icon'></span>" + ownerName + "</li>");
      _.each(repositories, function (repository) {
        var listItem = new D.RepositoryListItemView({ model: repository, listView: list });
        innerNode.append(listItem.render().el);
      });
    });

    return this;
  },

  add: function (repository) {
    $(this.el).find(".repository_list ul").append(new D.RepositoryListItemView({
      model: repository
    }).render().el);
  }

});

D.RepositoryListItemView = Backbone.View.extend({
  tagName: 'li',
  className: 'repository_list_item clearfix',

  events: {
    "click": "show"
  },

  initialize: function (options) {
    _.bindAll(this);
    this.listView = options.listView;
    this.model.bind("reset", this.render);
    this.model.get("buildList").bind("change", this.render);
    this.model.bind("destroy", this.remove);
  },

  render: function () {
    $(this.el).html(this.model.get("name") + "<span class='build_result'></span>");

    $(this.el).attr("class", "repository_list_item clearfix");
    $(this.el).addClass(this.model.status());

    if (this.listView && this.listView.selected && this.model.equals(this.listView.selected)) {
      this.select();
    }

    return this;
  },

  show: function () {
    var repo = this.model;

    D.appRouter.navigate("/" + repo.get("ownerName") + "/" + repo.get("name"));
    this.select();

    new D.RepositoryView({model: repo}).render();
  },

  select: function () {
    $(".repository_list_item").removeClass("current");
    $(this.el).addClass("current");
  },

  remove: function () {
    var model = this.model,
        bySameOwner = this.model.collection.filter(function (r) { 
          return r.get("ownerName") === model.get("ownerName"); 
        }), ownerNode;

    if (bySameOwner.length < 2) {
      ownerNode = $("#owner_" + this.model.get("ownerName"));
      ownerNode.remove();
    }

    $(this.el).remove();
  }

});
