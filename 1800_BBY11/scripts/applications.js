var userID;
var currentUser;
function getUser() {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      currentUser = db.collection("users").doc(user.uid);
      userID = user.uid;
    } else {
      // No user is signed in.
      console.log("No user is logged in");
    }

    displayCardsDynamically();
  });
}
getUser();

function displayCardsDynamically() {
  let cardTemplate = document.getElementById("questCardTemplate");

  db.collection("applications")
    .get()
    .then((allApps) => {
      allApps.forEach((appDoc) => {
        db.collection("quests")
          .doc(appDoc.data().quest_id)
          .get()
          .then((doc) => {
            if (doc.data().user_id == userID) {
              title = doc.data().title; // get value of the "name" key
              details = doc.data().details; // get value of the "details" key
              questTags = doc.data().tags;
              date = doc.data().date_created;
              thumbnail = doc.data().thumbnail;
              docID = doc.id;
              creatorID = doc.data().user_id; // ID of the quest creator
              newcard = cardTemplate.content.cloneNode(true);

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
              document
                .getElementById("historyQuestsContainer")
                .appendChild(newcard);

              document
                .getElementById("historyQuestsContainer")
                .lastElementChild.addEventListener("click", () => {
                  document.location.href = "./eachQuest.html?docID=" + doc.id;
                });
            }
          });
      });
    });
}
