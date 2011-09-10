var AppRouter = Backbone.Router.extend({

  routes: {
    "": "root",
    "/repositories/new":      "repositoriesAdd",
    "/repositories":          "repositoriesList",
    "/:ownerName/":           "repositoriesList",
    "/:ownerName/:name":      "repositoriesShow",
    "/:ownerName/:name/:id":  "buildShow"
  },

  beforeFilter: function (ownerName, name) {
    $("#main_logo").show();
    var appView = new AppView().render();
    var repositoryList = new RepositoryList();
    var repo = {};

    if (ownerName) { repo.ownerName = ownerName; }
    if (name) { repo.name = name; }

    var repositoryListView = new RepositoryListView({
      el: $(".repositories"),
      collection: repositoryList,
      selected: repo
    });

    return repositoryList;
  },

  root: function () {
    this.navigate("/repositories/new", true);
  },

  repositoriesAdd: function () {
    var addRepositoryView = new AddRepositoryView({
      model: new Repository()
    });
    $("#main_content").html(addRepositoryView.render().el);
  },

  repositoriesList: function (ownerName) {
    var repositoryList = this.beforeFilter(ownerName);
    repositoryList.fetch();
  },

  repositoriesShow: function (ownerName, name) {
    var repositoryList = this.beforeFilter(ownerName, name);

    repositoryList.bind("reset", function () {

      var repository = repositoryList.find(function (r) {
        return r.get("ownerName") === ownerName && r.get("name") === name;
      });
      new RepositoryView({model: repository}).render();
    });
    
    repositoryList.fetch();
  },
  
  buildShow: function (ownerName, name, id) {
    var repositoryList  = this.beforeFilter(ownerName, name),
        build           = new Build({_id: id, repository: {ownerName: ownerName, name: name} }),
        buildView       = new BuildView({model: build});

    repositoryList.bind("reset", function () {
      var repository = repositoryList.find(function (r) {
        return r.get("ownerName") === ownerName && r.get("name") === name;
      });
      new RepositoryView({model: repository, selectedBuild: id}).render();
    });
    
    repositoryList.fetch();
    build.fetch();
  }
});
