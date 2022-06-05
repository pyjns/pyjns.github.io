
let meessageLogger = function (topics, data) {
  console.log(`Logging: ${topics} : `,data)
}

let subscription = pubsub.subscribe("inbox/newMeessage", meessageLogger)

pubsub.publish("inbox/newMeessage", "hello world!")
pubsub.publish("inbox/newMeessage", ["a", "b", "c", "d"])
pubsub.publish("inbox/newMeessage", { sender: "yourself", msg: "welcome" })


pubsub.unsubscribe(subscription);

pubsub.publish("inbox/newMeessage", "hello! are you still there!")
