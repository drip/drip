D.BuildListView = Backbone.View.extend({
  tagName: 'div',
  className: 'builds',

  initialize: function (options) {
    _.bindAll(this);
    this.selectedBuild = options.selectedBuild;
  },

  render: function () {
    var el = this.el = $(this.el),
        list = this,
        frag = $( $("#build_list_template").html() ),
        latestBuildNode = frag.find(".latest_build"),
        listNode = frag.find(".build_list"),
        latestListNode = listNode.clone();

    latestBuildNode.append(latestListNode);

    _.each(this.collection.toArray(), function (build, i) {
      var listItem = new D.BuildListItemView({model: build, listView: list});
      if (i === 0) {
        latestListNode.append(listItem.render().el);
        return;
      }
      listNode.append(listItem.render().el);
    });

    el.html(frag);

    return this;
  }

});

D.BuildListItemView = Backbone.View.extend({
  tagName: 'li',
  className: 'build_list_item',

  events: {"click": "show"},

  initialize: function (options) {
    _.bindAll(this);
    this.listView = options.listView;
    this.model.bind("change:completed", this.render);
  },

  render: function () {
    var el = this.el = $(this.el);
    el.prop("className", "build_list_item");
    el.addClass(this.model.status());
    el.html("<span class='build_icon'></span>" + this.model.get("label"));
    if (this.model.get("_id") === this.listView.selectedBuild) {
      this.select();
    }
    return this;
  },

  show: function () {
    D.appRouter.navigate("/" + this.model.get("repository").ownerName + "/" + this.model.get("repository").name + "/" + this.model.id);
    this.select();
    
    var build = new D.Build(this.model.attributes);
    new D.BuildView({model: build});
        
    build.fetch();
  },

  select: function () {
    $(".build_list_item").removeClass("current");
    $(this.el).addClass("current");
  }

});
