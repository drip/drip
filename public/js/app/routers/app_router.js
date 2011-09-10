D.AppRouter = Backbone.Router.extend({

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
    var appView = new D.AppView().render();
    var repositoryList = new D.RepositoryList();
    var repo = {};

    if (ownerName) { repo.ownerName = ownerName; }
    if (name) { repo.name = name; }

    var repositoryListView = new D.RepositoryListView({
      el: $(".repositories"),
      collection: repositoryList,
      selected: repo
    });

    repositoryList.fetch();
  },

  root: function () {
    this.navigate("/repositories/new", true);
  },

  repositoriesAdd: function () {
    var addRepositoryView = new D.AddRepositoryView({
      model: new D.Repository()
    });
    $("#main_content").html(addRepositoryView.render().el);
  },

  repositoriesList: function (ownerName) {
    this.beforeFilter(ownerName);
  },

  repositoriesShow: function (ownerName, name) {
    this.beforeFilter(ownerName, name);

    var repository      = new D.Repository({ownerName: ownerName, name: name}),
        repositoryView  = new D.RepositoryView({model: repository});
        
    repository.fetch();
  },
  
  buildShow: function (ownerName, name, id) {
    this.beforeFilter(ownerName, name);

    var repository      = new D.Repository({ownerName: ownerName, name: name}),
        repositoryView  = new D.RepositoryView({model: repository, selectedBuild: id});
        
    repository.fetch();

    var build      = new D.Build({_id: id, repository: {ownerName: ownerName, name: name} }),
        buildView  = new D.BuildView({model: build});
        
    build.fetch();
  }
});
