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
            if (doc.data().availability != "Open") {
              return;
            }
            if (doc.data().user_id == userID) {
              title = doc.data().title; // get value of the "name" key
              details = appDoc.data().description; // get value of the "details" key
              questTags = doc.data().tags;
              date = doc.data().date_created;
              thumbnail = doc.data().thumbnail;
              docID = doc.id;
              let userId = appDoc.data().user_id;
              let appId = appDoc.id;
              creatorID = doc.data().user_id; // ID of the quest creator
              newcard = cardTemplate.content.cloneNode(true);

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

              let userName = appDoc.data().user_name || "Unknown User";
              let userPfp = appDoc.data().user_pfp;

              // Check for null, empty, or invalid profile picture
              if (!userPfp || userPfp.trim() === "") {
                userPfp = "./images/profile-default.jpeg"; // Fallback to a default profile picture
              }
              // Add the creator's profile with their picture and name
              let cratorProfile = newcard.querySelector(".creator-profile");
              cratorProfile.innerHTML = `
                    <img src="${userPfp}" alt="Profile Picture" style="width: 30px; height: 30px; border-radius: 50%; margin-right: 8px;">
                    <strong>${userName}</strong>
                `;

              newcard
                .querySelector(".acceptButton")
                .setAttribute("onClick", `javascript: accept("${appId}")`);
              newcard
                .querySelector(".denyButton")
                .setAttribute("onClick", `javascript: deny("${appId}")`);

              document
                .getElementById("historyQuestsContainer")
                .appendChild(newcard);

              document
                .getElementById("historyQuestsContainer")
                .lastElementChild.querySelector(".creator-profile")
                .addEventListener("click", () => {
                  document.location.href = "./profile.html?docID=" + userId;
                });

              document
                .getElementById("historyQuestsContainer")
                .lastElementChild.querySelectorAll("img")
                .forEach((elem) => {
                  elem.addEventListener("click", () => {
                    document.location.href = "./eachQuest.html?docID=" + doc.id;
                  });
                });
            }
          });
      });
    });
}

function accept(appID) {
  db.collection("applications")
    .doc(appID)
    .get()
    .then((appDoc) => {
      db.collection("quests").doc(appDoc.data().quest_id).update({
        availability: "Taken"
      });
      
      let userRef = db.collection("users").doc(appDoc.data().user_id);
      userRef.get().then((userDoc) => {
        let array = userDoc.data().quests_taken;

        if (!array || array.length == 0) {
          array = [appDoc.data().quest_id];
        } else if (array.length != 0 && !array.includes(appDoc.data().quest_id)) {
          array.push(appDoc.data().quest_id);
        }

        userRef.set(
          {
            quests_taken: array,
          },
          { merge: true }
        );
      });

      //deny(appID);
    });
}

function deny(appID) {
  db.collection("applications").doc(appID).delete();
}
