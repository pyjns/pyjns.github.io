
let usersE = document.getElementById("users");
let ratingsE = document.getElementById("ratings");
let addE = document.getElementById("add");


pubsub.subscribe("/new/user", function (e, data) {
  if (data) {
    let liE = document.createElement("li");
    liE.textContent = data.name;

    usersE.appendChild(liE)
  }
});

pubsub.subscribe("/new/rating", function (e, data) {
  if (data) {
    let liE = document.createElement("li");
    liE.textContent = data.title + " : " + data.rating;

    ratingsE.appendChild(liE);
  }
});

addE.onclick = function (e) {
  e.preventDefault();
  let strUser = document.getElementById("twitter_handle").value;
  let strMovie = document.getElementById("movie_seen").value;
  let strRating = document.getElementById("movie_rating").value;

  pubsub.publish("/new/user", { name: strUser });

  pubsub.publish("/new/rating", { title: strMovie, rating: strRating });

}