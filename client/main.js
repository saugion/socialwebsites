/// routing 

Router.configure({
  layoutTemplate: 'ApplicationLayout'
});

Router.route('/', function () {
	this.render('website_login', {
		to:"login"
	});
	this.render('website_navbar', {
		to:"navbar"
	});
	this.render('website_form', {
	  	to:"add"
	});
	this.render('website_list', {
	  	to:"main"
	});
});

Router.route('/website/:_id', function () {
	this.render('website_login', {
		to:"login"
	});
	this.render('website_navbar', {
		to:"navbar"
	});
    this.render('website_item', {
    	to:"main", 
    	data:function(){
      		return Websites.findOne({_id:this.params._id});
    	}
  	});
  	this.render('comments_list', {
  		to:"comments"
  	});
});

Accounts.ui.config({
	passwordSignupFields: "USERNAME_AND_EMAIL"
});

/////
// template helpers 
/////

Template.website_item.helpers({
	formatDate: function(date) {
		return moment(date).format("LLLL");
	}
});

// helper function that returns all available websites
Template.website_list.helpers({
	websites:function(){
		return Websites.find({}, {sort:{rating: -1}});
	}
});

Template.comments_list.helpers({
	comments: function() {
		return Comment.find({}, {sort:{postedOn: -1}});
	}
});

Template.single_comment.helpers({
	formatDate: function(date) {
		return moment(date).format("LLLL");
	},

	username: function() {
		return Meteor.user().username;
	}
});


/////
// template events 
/////

Template.website_item.events({

	// upvote website
	"click .js-upvote":function(event){
		if (Meteor.user()) {
			
			// up vote
			if (checkVote(Meteor.user()._id, this._id)) {
				Websites.update({"_id":this._id}, {$set: {rating:this.rating + 1}});
			}
			else {
				console.log("already voted");
			}
			
	   	
			// put the code in here to add a vote to a website!

			return false;// prevent the button from reloading the page
		}
	}, 

	// downvot website
	"click .js-downvote":function(event){

		if (Meteor.user()) {

			// down vote 
			if (checkVote(Meteor.user()._id, this._id)) {
				Websites.update({"_id":this._id}, {$set: {rating:this.rating - 1}});
			}
			else {
				console.log("already voted");
			}

			return false;// prevent the button from reloading the page
		}
	},

	// remove website
	"click .js-remove":function(event){
		if (Meteor.user()) {
			Websites.remove({"_id":this._id});

			return false;
		}
	}
});

Template.website_form.events({
	"click .js-toggle-website-form":function(event){
		$("#website_form").toggle('slow');
	}, 
	"submit .js-save-website-form":function(event){

		// here is an example of how to get the url out of the form:
		var title, url, description, createdOn;

	    title = event.target.title.value;
	    url = event.target.url.value;
	    description = event.target.description.value;
		
		//  put your website saving code in here!
  		Websites.insert({
	        title:title, 
	        url:url, 
	        description: description,
	        createdOn:new Date(),
	        rating:0,
	        addedBy:Meteor.user()._id,
  		});

    	$("#website_form").toggle('slow');

		return false;// stop the form submit from reloading the page

	}
});

Template.comments_list.events({
	"click .js-add-comment":function(event) {

		if (Meteor.user()) {
			var text = $('#comment').val();
			
			Comment.insert({
				text:text,
				postedBy:Meteor.user().username,
				postedOn:new Date()
			});

			$('#comment').val("");
		}

		return false;
	}
});


/***** helper methods ******/

function checkVote(userId, websiteId) {
	var vote = Vote.findOne({userId:userId, websiteId:websiteId});
	if (!vote) {
		var votes = Vote.insert({userId:userId, websiteId:websiteId});
		Websites.update({"_id":websiteId}, {$set: {vote:vote}});
		return true;
	}
	else {
		return false;
	}
}