let pubsub = {};

(function (pubsub) {

  let topics = {};

  let subUid = -1;

  pubsub.subscribe = function (topic, func) {
    if (!topics[topic]) {
      topics[topic] = [];
    }

    let token = (++subUid).toString();

    topics[topic].push({ token, func });

    return token;
  }

  pubsub.unsubscribe = function (token) {
    for (let key in topics) {
      if (topics[key]) {
        for (let i = 0, j = topics[key].length; i < j; i++) {
          if (topics[key][i].token === token) {
            topics[key].splice(i, 1);
            return token;
          }
        }
      }
    }
  }

  pubsub.publish = function (topic, args) {
    if (!topics[topic]) {
      return false;
    }

    let subscribers = topics[topic];
    let subIndex = subscribers ? subscribers.length : 0;

    while (subIndex--) {
      subscribers[subIndex].func(topic, args);
    }
  }

}(pubsub))