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


/////
// template events 
/////

Template.website_item.events({
	"click .js-upvote":function(event){
		// example of how you can access the id for the website in the database
		// (this is the data context for the template)
		Websites.update({"_id":this._id},
			{$set: {rating:this.rating + 1}});
   	
		// put the code in here to add a vote to a website!

		return false;// prevent the button from reloading the page
	}, 
	"click .js-downvote":function(event){

		// example of how you can access the id for the website in the database
		// (this is the data context for the template)
		Websites.update({"_id":this._id},
			{$set: {rating:this.rating - 1}});

		// put the code in here to remove a vote from a website!

		return false;// prevent the button from reloading the page
	},
	"click .js-remove":function(event){
		Websites.remove({"_id":this._id});

		return false;
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