var topics = {};

var Pubsub = function(channel) {
    var callbacks,
        topic = channel && topics[channel];

    if (!topic) {
        callbacks = jQuery.Callbacks();
        topic = {
            pub: callbacks.fire,
            sub: callbacks.add,
            unsub: callbacks.remove
        };
        if (channel) {
            topics[channel] = topic;
        }
    }
    return topic;
};

export default Pubsub;