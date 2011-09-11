D.Build = Backbone.Model.extend({
  urlRoot: '/repositories',

  initialize: function (attrs) {
    if (attrs._id) { this.id = attrs._id; }
    this.bind("change:receivedAt", this.setLabel, this);
    this.setLabel();

    if (!this.get("completed")) {
      this.refreshUntilComplete();
    }
  },

  refreshUntilComplete: function () {
    var build = this;
    var interval = setInterval(function () {
      if (build.get("completed")) {
        build.trigger("change:completed");
        clearInterval(interval);
      }
      else {
        build.fetch({success: function () {
          //build.trigger("change");
        }});
      }
    }, 1000);
  },

  setLabel: function () {
    // var label = new Date(this.get("receivedAt")).getTime();
    var label = this.get("_id");
    this.set({"label": label}, {silent: true});
  },
  
  url: function () {
    var urlError = function() {
      throw new Error('A "url" property or function must be specified');
    };
    
    var url = [],
        base = this.urlRoot || urlError();
    
    // http://localhost:8000/repositories/visionmedia/stats/builds/4e59c85770da665d7200027b
    url.push(base);
    url.push(this.get('repository').ownerName);
    url.push(this.get('repository').name);
    url.push('builds');
    url.push(this.id);
    
    return url.join('/');
  },

  status: function () {
    var state = (this.get("completed") ? (this.get("successful") ? "success" : "failure") : (this.get("running") ? "running" : "unknown"));
    return state;
  }
  
});
