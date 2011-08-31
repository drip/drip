var BuildListView = Backbone.View.extend({
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
      var listItem = new BuildListItemView({model: build});
      if (i === 0) {
        latestListNode.append(listItem.render().el);
        if (build.get("_id") === list.selectedBuild) {
          listItem.select();
        }
        return;
      }
      
      listNode.append(listItem.render().el);
      if (build.get("_id") === list.selectedBuild) {
        listItem.select();
      }

    });

    el.html(frag);

    return this;
  }

});

var BuildListItemView = Backbone.View.extend({
  tagName: 'li',
  className: 'build_list_item',

  events: {"click": "show"},

  initialize: function () {
    _.bindAll(this);
    this.model.bind("change:completed", this.render);
  },

  render: function () {
    var el = this.el = $(this.el);
    el.prop("className", "build_list_item");
    el.addClass(this.model.status());
    el.html("<span class='build_icon'></span>" + this.model.get("label"));
    return this;
  },

  show: function () {
    appRouter.navigate("/" + this.model.get("repository").ownerName + "/" + this.model.get("repository").name + "/" + this.model.id);
    this.select();
    
    var build = new Build(this.model.attributes);
    new BuildView({model: build});
        
    build.fetch();
  },

  select: function () {
    $(".build_list_item").removeClass("current");
    $(this.el).addClass("current");
  }



});
