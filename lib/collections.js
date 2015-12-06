Websites = new Mongo.Collection("websites");

// set up security on Websites collection
Websites.allow({

	// we need to be able to update websites for ratings.
	update:function(userId, doc){
		if (Meteor.user()){// they are logged in
			return true;
		} else {// user not logged in - do not let them update  (rate) the image. 
			return false;
		}
	},

	insert:function(userId, doc){
		if (Meteor.user()){// they are logged in
			return true;
		}
		else {// user not logged in
			return false;
		}
	},

	remove:function(userId, doc){
		if (Meteor.user()) {
			if (userId != doc.addedBy) {
				return false;
			}
			else {
				return true;
			}
		} else {
			return false;
		}
	}
});