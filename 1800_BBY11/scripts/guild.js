var currentUser;    
function getNameFromAuth() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            currentUser = db.collection("users").doc(user.uid);

            checkForDisplayableGuilds(user.uid);

            currentUser.get().then((userDoc) => {
                document.getElementById("name").innerHTML = userDoc.data().name
            })
        } else {
            // No user is signed in.
            console.log("No user is logged in");
        }
    });
}

function checkForDisplayableGuilds(userID) {
    db.collection("guilds").get().then(allGuilds => {
        allGuilds.forEach((doc) => {
            if (doc.data().public) {
                displayGuild(doc);
            } else if ((doc.data().members && doc.data().members.includes(userID)) || doc.data().owner == userID) {
                displayGuild(doc);
            }
        })
    })
}

function displayGuild(doc) {
    guildsDisplay = document.getElementById('guilds-go-here');
    newguild = document.getElementById("guildCardTemplate").content.cloneNode(true);

    newguild.querySelector('.card-title').innerHTML = doc.data().name;
    newguild.querySelector('.card-text').innerHTML = doc.data().description;


    guildsDisplay.appendChild(newguild);

    guildsDisplay.lastElementChild.addEventListener("click", () => {
        document.location.href = "./eachGuild.html?docID="+doc.id;
    })
    
}

getNameFromAuth();


// function displayCardsDynamically(collection) {
//     let cardTemplate = document.getElementById("questCardTemplate"); // Retrieve the HTML element with the ID "hikeCardTemplate" and store it in the cardTemplate variable. 

//     db.collection(collection).get()   //the collection called "quests"
//         .then(allQuest => {
//             //var i = 1;  //Optional: if you want to have a unique ID for each hike
//             allQuest.forEach(doc => { //iterate thru each doc
//                 title = doc.data().title;       // get value of the "name" key
//                 details = doc.data().details;  // get value of the "details" key
//                 questTags = doc.data().tags;
//                 date = doc.data().date_created;
//                 thumbnail = doc.data().thumbnail;
//                 docID = doc.id;
//                 newcard = cardTemplate.content.cloneNode(true); // Clone the HTML template to create a new card (newcard) that will be filled with Firestore data.

//                 //update title and text and image
//                 newcard.querySelector('.card-title').innerHTML = title;
//                 newcard.querySelector('.card-text').innerHTML = details;
//                 if (!thumbnail) {
//                     newcard.querySelector('.card-image').src = `./images/Quest.png`;
                    
//                 } else {
//                     newcard.querySelector('.card-image').src = thumbnail;
//                 }
                
//                 let tags = ""
//                 questTags.forEach((val) => {
//                     tags += `<span style="white-space:pre;background:#c75146;border-radius:10%;display:inline-block">  ${val}  </span><span style="white-space:pre;">  </span>`
//                 })

//                 let eta = doc.data().estimated_time
                
//                 newcard.querySelector('.card-pay').innerHTML = doc.data().pay
//                 newcard.querySelector('.card-time').innerHTML = doc.data().estimated_time + ` hour${eta > 1 ? "s" : ""}`;

//                 newcard.querySelector('.card-tags').innerHTML = tags;

//                 newcard.querySelector('a').href = "eachQuest.html?docID=" + docID;
//                 newcard.querySelector('i').id = 'save-' + docID;   //guaranteed to be unique

//                 newcard.querySelector('i').onclick = () => saveBookmark(docID);

                


//                 //Optional: give unique ids to all elements for future use
//                 // newcard.querySelector('.card-title').setAttribute("id", "ctitle" + i);
//                 // newcard.querySelector('.card-text').setAttribute("id", "ctext" + i);
//                 // newcard.querySelector('.card-image').setAttribute("id", "cimage" + i);

//                 //attach to gallery, Example: "hikes-go-here"
//                 document.getElementById(collection + "-go-here").appendChild(newcard);

//                 //i++;   //Optional: iterate variable to serve as unique ID
//             })
//         })
// }

//displayCardsDynamically("quests");  //input param is the name of the collection








// function saveBookmark(questDocID) {
//     // Manage the backend process to store the questDocID in the database, recording which hike was bookmarked by the user.
//     currentUser.update({
//         // Use 'arrayUnion' to add the new bookmark ID to the 'bookmarks' array.
//         // This method ensures that the ID is added only if it's not already present, preventing duplicates.
//         bookmarks: firebase.firestore.FieldValue.arrayUnion(questDocID)
//     })
//         // Handle the front-end update to change the icon, providing visual feedback to the user that it has been clicked.
//         .then(function () {
//             console.log("bookmark has been saved for" + questDocID);
//             let iconID = 'save-' + questDocID;
//             //console.log(iconID);
//             //this is to change the icon of the hike that was saved to "filled"
//             document.getElementById(iconID).innerText = 'bookmark';
//         });
// }

// function updateBookmark(questDocID) {
//     //  alert("Inside update Bookmark");

//     currentUser.get().then(doc => {
//         console.log(doc.data());
//         currentBookmarks = doc.data().bookmarks;

//         if (currentBookmarks && currentBookmarks.includes(questDocID)) {
//             console.log(questDocID);
//             currentUser.update({
//                 bookmarks: firebase.firestore.FieldValue.arrayRemovw(questDocID),
//             })
//                 .then(function () {
//                     console.log("The Bookmark is removed for" + currentUser);
//                     let iconID = "save-" + questDocID;
//                     comsole.log(iconID);
//                     document.getElementById(iconID);
//                     document.getElementById(iconID).innerText = "bookemar_border";
//                 })
//         } else {
//             currentUser.set({
//                 bookmarks: firebaseConfig.firestore.FieldValue.arrayUnion(questDocID),
//             },
//                 {
//                     merge: true
//                 })
//                 .then(function () {
//                     console.log("The Bookmark is removed for" + currentUser);
//                     let iconID = "save-" + questDocID;
//                     comsole.log(iconID);
//                     document.getElementById(iconID).innerText = "bookemark";
//                 })



//         }
//     })
// }
