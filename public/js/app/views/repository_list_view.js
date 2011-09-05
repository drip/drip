var RepositoryListView = Backbone.View.extend({

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
      innerNode.append("<li class='clearfix owner_name'><span class='user_icon'></span>" + ownerName + "</li>");
      _.each(repositories, function (repository) {
        var listItem = new RepositoryListItemView({ model: repository });
        innerNode.append(listItem.render().el);
        if (list.selected) {
          if (repository.get("ownerName") === list.selected.ownerName && repository.get("name") === list.selected.name) {
            listItem.select();
          }
        }
      });
    });

    return this;
  },

  add: function (repository) {
    $(this.el).find(".repository_list ul").append(new RepositoryListItemView({
      model: repository
    }).render().el);
  }

});

var RepositoryListItemView = Backbone.View.extend({
  tagName: 'li',
  className: 'repository_list_item clearfix',

  events: {
    "click": "show"
  },

  intialize: function () {
    _.bindAll(this);
    this.model.bind("reset", this.render);
    this.model.bind("destroy", this.remove);
  },

  render: function () {
    $(this.el).html(this.model.get("name") + "<span class='build_result'></span>");
    $(this.el).addClass(this.model.status());
    return this;
  },

  show: function () {
    var repo = this.model;

    appRouter.navigate("/" + repo.get("ownerName") + "/" + repo.get("name"));
    this.select();

    new RepositoryView({model: repo});
    repo.fetch({success: function () {
      repo.trigger("change");
    }});

  },

  select: function () {
    $(".repository_list_item").removeClass("current");
    $(this.el).addClass("current");
  },

  remove: function () {
    $(this.el).remove();
  }

});
