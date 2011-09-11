D.AddRepositoryView = Backbone.View.extend({

  tagName: "div",
  className: "add_repository",

  events: {
    "submit #add_repo_form": "save",
    "focus .repository_url_input": "focusInput"
  },

  initialize: function () {
    _.bindAll(this);
  },

  render: function () {
    $("#main_logo").hide();
    $(this.el).html(_.template($("#add_repository_tmpl").html()));
    return this;
  },

  save: function (ev) {
    ev.preventDefault();
    
    var input             = this.$(".repository_url_input"),
        errorMessageNode  = this.$(".error_message"),
        url               = input.val(),
        urlChunks         = url.split('/'),
        name              = urlChunks[urlChunks.length-1].replace(/\.git$/,""),
        ownerName         = urlChunks[urlChunks.length-2];

    this.reset();

    this.model.bind("error", function (model, error) {
      errorMessageNode.html(error);
      errorMessageNode.fadeIn(200);
      input.addClass("error");
    });

    this.model.save({url: url,
                     name: name,
                     owner: {name: ownerName},
                    },
                    {
                      error: function (model, response) {
                        errorMessageNode.html("Could not save").show();
                      },
                      success: function (model, response) {
                        D.appRouter.navigate(
                          "/" + model.get("owner").name + 
                          "/" + model.get("name") +
                          "/" + response.buildId
                        , true);
                      }
                   });
  },

  reset: function () {
    var errorMessageNode = this.$(".error_message");
    this.$(".repository_url_input").removeClass("error");
    errorMessageNode.html("");
    errorMessageNode.hide();
  },
  
  focusInput: function () {
    var input = this.$(".repository_url_input");
    
    if(input.val() === input.attr('placeholder')) {
      input.val('');
    }
  }

});
