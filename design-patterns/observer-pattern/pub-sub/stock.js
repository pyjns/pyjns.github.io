
function getCurrentTime() {
  let date = new Date();
  return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} /${date.toLocaleDateString().toLowerCase()}`;
}

function addGridRow(data) {
  console.log("updated grid componenet with: ", data)
}

function updateCounter(data) {
  console.log(`data last updated at : ${getCurrentTime()} with`, data)
}

function gridUpdate(topic, data) {
  if (data != undefined) {
    addGridRow(data);
    updateCounter(data);
  }
}

let subscriber = pubsub.subscribe("newDataAvailabel", gridUpdate)

pubsub.publish("newDataAvailabel", {
  summary: "Apple made $5 billion",
  identifier: "APPL",
  stockPrice: 570.91
});

pubsub.publish("newDataAvailable", {
  summary: "Microsoft made $20 million",
  identifier: "MSFT",
  stockPrice: 30.85
});