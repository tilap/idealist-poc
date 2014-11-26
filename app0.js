Tasks = new Mongo.Collection("tasks");

if (Meteor.isClient) {
  Meteor.subscribe("ideas");

  Template.body.helpers({
    tasks: function () {
      return Tasks.find({}, {sort: {createdAt: -1}});
    },
    hideCompleted: function () {
      return Session.get("hideCompleted");
    },
    totalCount: function () {
      return Tasks.find().count();
    },
    displayAdd : function() {
      return Meteor.userId() && Session.get("screenState")=='add';
    },
    displayWelcome: function() {
      return Session.get("screenState")=='welcome';
    },
    displayDetails: function() {
      return Meteor.userId() && Session.get("screenState")=='details';
    }
  });

  Template.task.helpers({
    isOwner: function () {
      return this.owner === Meteor.userId();
    }
  });

  Template.task.events({
    "click .delete": function () {
      Meteor.call("deleteIdea", this._id);
    }
  });

  Template.body.events({
    "submit .new-idea": function (event) {
      var title = document.getElementById('new-idea-title').value,
          details = document.getElementById('new-idea-details').value;
      if(''===title) {
        alert('You must provide a title');
        return false;
      }

      Meteor.call("addIdea", title, details);

      document.getElementById('new-idea-title').value = "";
      document.getElementById('new-idea-details').value = "";

      Session.set("screenState", 'welcome');
      return false;
    },

    "click .show-addform": function (event) {
      Session.set("screenState", 'add');
    },
    "click .show-welcome": function (event) {
      Session.set("screenState", 'welcome');
    }
  });

  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });
  
  Session.set("screenState", 'welcome');
}

if (Meteor.isServer) {
  Meteor.publish("ideas", function () {
    return Tasks.find();
  });
}

Meteor.methods({
  addIdea: function (title, details) {
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    Tasks.insert({
        title: title,
        details: details,
        owner: Meteor.userId(),
        username: Meteor.user().username,
        createdAt: new Date()
      });
  },
  deleteIdea: function (ideaId) {
    var idea = Tasks.findOne(ideaId);
    if (idea.owner !== 12) {
      throw new Meteor.Error("not-authorized");
    }
    Tasks.remove(taskId);
  }
});