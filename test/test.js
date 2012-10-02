var ChildView1, ChildView2, ChildView3, ParentView,
	child1, child2, child3, parent, gramps,
	eventsFired;

module("BubbleView", {
	setup: function(){
		eventsFired = {
			'child1': {
				'hidden': false,
				'shown': false
			},
			'child2': {
				'hidden': false,
				'shown': false
			},
			'child3': {
				'hidden': false,
				'shown': false
			},
			'parent': {
				'hidden': false,
				'shown': false
			},
			'gramps': {
				'hidden': false,
				'shown': false
			}
		};

		/* User constructors */

		/*
		 * Parent view doesn't have any events declared in `eventsToListenFor`.
		 * It should still conduct them through.
		 */ 
		ParentView = BubbleView.extend({
			shown: function(){
		        eventsFired['parent']['shown'] = true;
		    },
		    hidden: function(){
		        eventsFired['parent']['hidden'] = true;
		    }
		});

		/* 
		 * This extension has both event handlers, as well as the eventsToListenFor on the constructor. 
		 * It should respond to both events. 
		 */
		ChildView1 = BubbleView.extend({
		    shown: function(){
		        eventsFired['child1']['shown'] = true;
		    },
		    hidden: function(){
		        eventsFired['child1']['hidden'] = true;
		    }
		}, {
			eventsToListenFor: ['shown', 'hidden']
		});

		/*
		 * This extension has both events in eventsToListenFor, but only the 'hidden' handler defined.
		 * It should only respond to the 'hidden event'.
		 */ 
		ChildView2 = BubbleView.extend({
		    hidden: function(){
		        eventsFired['child2']['hidden'] = true;
		    }
		}, {
			eventsToListenFor: ['shown', 'hidden']
		});

		/*
		 * This extension has both handlers, but none of the two events is in eventsToListenFor.
		 * It should respond to neither of them.
		 */
		ChildView3 = BubbleView.extend({
		    shown: function(){
		        eventsFired['child3']['shown'] = true;
		    },
		    hidden: function(){
		        eventsFired['child3']['hidden'] = true;
		    }
		}, {
			eventsToListenFor: ['some other event']
		});

		// instances
		gramps = new Backbone.View();
		parent = new ParentView();
		child1 = new ChildView1();
		child2 = new ChildView2();
		child3 = new ChildView3();

		parent.bindToParent(gramps);
		child1.bindToParent(parent);
		child2.bindToParent(parent);
		child3.bindToParent(parent)
	}
});

test("Instances created", function(){
	ok(gramps instanceof Backbone.View);
	ok(parent instanceof BubbleView);
	ok(child1 instanceof BubbleView);
	ok(child2 instanceof BubbleView);
	ok(child3 instanceof BubbleView);
});

test("A BubbleView extension that does not have certain events listed in `eventsToListenFor`, \
	should not respond to them, even when the handling methods are defined", function(){
	gramps.trigger('shown').trigger('hidden');

	equal(eventsFired['child3']['shown'], false, "`shown` has not been triggered.");
	equal(eventsFired['child3']['hidden'], false, "`hidden` has not been triggered.");
});

test("When a BubbleView extension doesn't have a handler defined for an event defined in \
	`eventsToListenFor`, it should not respond to that event, and not throw an error either.", function(){
	gramps.trigger('shown').trigger('hidden');

	equal(eventsFired['child2']['shown'], false, "`shown` has no handler, therefore, it has not been triggered.");
	equal(eventsFired['child2']['hidden'], true, "`hidden` has been triggered.");
});

test("When a BubbleView extension lists bubble events in `eventsToListenFor`, and defines handlers \
	for those events, then it should react to them.", function(){
	gramps.trigger('shown').trigger('hidden');

	equal(eventsFired['child1']['shown'], true, "`shown` has been triggered.");
	equal(eventsFired['child1']['hidden'], true, "`hidden` has been triggered.");
});