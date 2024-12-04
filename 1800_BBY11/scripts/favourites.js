var currentUser; //points to the document of the user who is logged in

function populateUserInfo() {
  firebase.auth().onAuthStateChanged((user) => {
    // Check if user is signed in:
    if (user) {
      //go to the correct user document by referencing to the user uid
      currentUser = db.collection("users").doc(user.uid);
      //get the document for current user.
      populateHistory();
    } else {
      // No user is signed in.
      console.log("No user is signed in");
    }
  });
}
populateUserInfo();

function populateHistory() {
  currentUser.get().then((userDoc) => {
    if (userDoc.data().quests_watched && userDoc.data().quests_watched.length != 0) {
      userDoc.data().quests_watched.map(makeCard);
    }   
  });
}

function makeCard(questID) {
  db.collection("quests")
    .doc(questID)
    .get()
    .then((doc) => {
      let cardTemplate = document.getElementById("questCardTemplate");
      title = doc.data().title; // get value of the "name" key
      details = doc.data().details; // get value of the "details" key
      questTags = doc.data().tags;
      date = doc.data().date_created;
      thumbnail = doc.data().thumbnail;
      docID = doc.id;
      newcard = cardTemplate.content.cloneNode(true); // Clone the HTML template to create a new card (newcard) that will be filled with Firestore data.

      //update title and text and image
      newcard.querySelector(".card-title").innerHTML = title;
      newcard.querySelector(".card-text").innerHTML = details;
      if (!thumbnail) {
        newcard.querySelector(".card-image").src = `./images/Quest.png`;
      } else {
        newcard.querySelector(".card-image").src = thumbnail;
      }

      let tags = "";
      questTags.forEach((val) => {
        tags += `<span style="white-space:pre;background:#c75146;border-radius:10%;display:inline-block">  ${val}  </span><span style="white-space:pre;">  </span>`;
      });

      let eta = doc.data().estimated_time;

      newcard.querySelector(".card-pay").innerHTML = doc.data().pay;
      newcard.querySelector(".card-time").innerHTML =
        doc.data().estimated_time + ` hour${eta > 1 ? "s" : ""}`;

      newcard.querySelector(".card-tags").innerHTML = tags;

      newcard.querySelector("i").id = "save-" + docID; //guaranteed to be unique

      newcard.querySelector("i").onclick = () => saveBookmark(docID);

      //Optional: give unique ids to all elements for future use
      // newcard.querySelector('.card-title').setAttribute("id", "ctitle" + i);
      // newcard.querySelector('.card-text').setAttribute("id", "ctext" + i);
      // newcard.querySelector('.card-image').setAttribute("id", "cimage" + i);

      //attach to gallery, Example: "hikes-go-here"
      document.getElementById("historyQuestsContainer").appendChild(newcard);

      document
        .getElementById("historyQuestsContainer")
        .lastElementChild.addEventListener("click", () => {
          document.location.href = "eachQuest.html?docID=" + docID;
        });
    });
}
