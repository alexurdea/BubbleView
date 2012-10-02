var BubbleView;

if (!Backbone){
    throw new Error('Backbone is not defined!');
}

BubbleView = Backbone.View.extend({
    initialize: function(){
        this.boundMethods = {};
    },

    bindToParent: function(parent){
        var i, event;

        this.parent = parent;
        for (i = 0; i < this.constructor.eventsToListenFor.length; i++){
            event = this.constructor.eventsToListenFor[i];
            this._makeBoundMethod(event);
        }
    },
    
    _makeBoundMethod: function(event){
        var boundMetod = function(){
            if (typeof this[event] == "function"){
                this[event]();
            }
            /* bubble on, for the kids, even if not implemented on this instance */
            this.trigger(event);
        };
        
        this.boundMethods[event] = boundMetod;
        this.parent.bind(event, boundMetod, this);
    },

    unbindFromParent: function(){
        var event;

        for (event in this.boundMethods){
            if (this.boundMethods.hasOwnProperty(event)){
                this.parent.unbind(event, this.boundMethods[event], this);
                delete this.boundMethods[event];
            }
        }
    }

}, {
    eventsToListenFor: ['shown', 'hidden']
});
