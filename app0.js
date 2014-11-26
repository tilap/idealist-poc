Tasks = new Mongo.Collection("tasks");

if (Meteor.isClient) {
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
      return Session.get("screenState")=='add';
    },
    displayWelcome: function() {
      return Session.get("screenState")=='welcome';
    },
    displayDetails: function() {
      return Session.get("screenState")=='details';
    }
  });

  Template.task.events({
    "click .delete": function () {
      Tasks.remove(this._id);
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
      Tasks.insert({
        title: title,
        details: details,
        owner: Meteor.userId(),
        username: Meteor.user().username,
        createdAt: new Date()
      });

      title.value = "";
      details.value = "";

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