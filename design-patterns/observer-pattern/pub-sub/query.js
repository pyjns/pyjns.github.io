let lastQueryE = document.getElementById("lastQuery");
let searchResultsE = document.getElementById("searchResults");
let flickrSearchE = document.getElementById("flickrSearch");

pubsub.subscribe("/search/tags", function (e, tags) {
  lastQueryE.textContent = `Searched for: ${tags}`;
});

pubsub.subscribe("/search/tags", function (e, tags) {
  pubsub.publish("/search/resultSet", `this is query ${tags} results`);
});

pubsub.subscribe("/search/resultSet", function (e, results) {
  searchResultsE.textContent = `${results}`;
});


flickrSearchE.onclick = function (e) {
  e.preventDefault();

  let tags = document.getElementById("query").value;

  if (!tags) {
    return;
  }
  pubsub.publish("/search/tags", tags);
}






