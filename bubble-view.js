var BubbleView;

if (!Backbone){
    throw new Error('Backbone is not defined!');
}

BubbleView = Backbone.View.extend({
    bindToParent: function(parent){
        var self = this,
            i, event;

        this.boundMethods || (this.boundMethods = {});

        this.parent = parent;
        _.each(this.constructor.bubbleEvents, function(event){
            self._makeBoundMethod(event);
        });
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

        if (!this.boundMethods) return;

        for (event in this.boundMethods){
            if (this.boundMethods.hasOwnProperty(event)){
                this.parent.unbind(event, this.boundMethods[event], this);
                delete this.boundMethods[event];
            }
        }

        delete this.parent;
    }

}, {
    bubbleEvents: []
});
