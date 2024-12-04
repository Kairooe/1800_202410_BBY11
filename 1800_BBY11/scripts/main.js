// function getNameFromAuth() {
//     firebase.auth().onAuthStateChanged(user => {
//         // Check if a user is signed in:
//         if (user) {
//             // Do something for the currently logged-in user here: 
//             //console.log(user.uid); //print the uid in the browser console
//             //console.log(user.displayName);  //print the user name in the browser console
//             userName = user.displayName;

//             //method #1:  insert with JS
//             //document.getElementById("name-goes-here").innerText = userName;    

//             //method #2:  insert using jquery
//             //$("#name-goes-here").text(userName); //using jquery

//             //method #3:  insert using querySelector
//             //document.querySelector("#name-goes-here").innerText = userName

//         } else {
//             // No user is signed in.
//             console.log("No user is logged in");
//         }
//     });
// }
// getNameFromAuth(); //run the function


// // Function to read the quote of the day from the Firestore "quotes" collection
// // Input param is the String representing the day of the week, aka, the document name
// function readQuote(day) {
//     db.collection("quotes").doc(day)                                                         //name of the collection and documents should matach excatly with what you have in Firestore
//         .onSnapshot(dayDoc => {                                                              //arrow notation
//             //console.log("current document data: " + dayDoc.data());                          //.data() returns data object
//             //document.getElementById("quote-goes-here").innerHTML = dayDoc.data().quote;      //using javascript to display the data on the right place

//             //Here are other ways to access key-value data fields
//             //$('#quote-goes-here').text(dayDoc.data().quote);         //using jquery object dot notation
//             //$("#quote-goes-here").text(dayDoc.data()["quote"]);      //using json object indexing
//             //document.querySelector("#quote-goes-here").innerHTML = dayDoc.data().quote;

//         }, (error) => {
//             console.log("Error calling onSnapshot", error);
//         });
// }
// readQuote("tuesday");        //calling the function

// //------------------------------------------------------------------------------
// // Input parameter is a string representing the collection we are reading from
// //------------------------------------------------------------------------------
// function displayCardsDynamically(collection) {
//      // Retrieve the HTML element with the ID "hikeCardTemplate" and store it in the cardTemplate variable. 

//     db.collection(collection).get()   //the collection called "quests"
//         .then(allQuest => {
//             //var i = 1;  //Optional: if you want to have a unique ID for each hike
//             allQuest.forEach(doc => { //iterate thru each doc

//                 if (doc.data().guild != null && doc.data().guild != "") {
//                     db.collection("guilds").get().then(allGuilds => {
//                         allGuilds.forEach(guild => {


//                             if (guild.data().public && doc.data().guild == guild.id) {

//                                 makeCard(doc);
//                             }

//                         })
//                     })
//                 } else {
//                     makeCard(doc);
//                 }




//                 //i++;   //Optional: iterate variable to serve as unique ID
//             })
//         })
// }
// var i = 0;
// function makeCard(doc) {
//     let cardTemplate = document.getElementById("questCardTemplate");
//     title = doc.data().title;       // get value of the "name" key
//     details = doc.data().details;  // get value of the "details" key
//     questTags = doc.data().tags;
//     date = doc.data().date_created;
//     thumbnail = doc.data().thumbnail;
//     let docID = doc.id;
//     newcard = cardTemplate.content.cloneNode(true); // Clone the HTML template to create a new card (newcard) that will be filled with Firestore data.



//     //update title and text and image
//     newcard.querySelector('.card-title').innerHTML = title;
//     newcard.querySelector('.card-text').innerHTML = details;
//     if (!thumbnail) {
//         newcard.querySelector('.card-image').src = `./images/Quest.png`;

//     } else {
//         newcard.querySelector('.card-image').src = thumbnail;
//     }


//     let tags = ""
//     questTags.forEach((val) => {
//         tags += `<span style="white-space:pre;background:#c75146;border-radius:10%;display:inline-block">  ${val}  </span><span style="white-space:pre;">  </span>`
//     })

//     let eta = doc.data().estimated_time

//     newcard.querySelector('.card-pay').innerHTML = doc.data().pay
//     newcard.querySelector('.card-time').innerHTML = doc.data().estimated_time + ` hour${eta > 1 ? "s" : ""}`;

//     newcard.querySelector('.card-tags').innerHTML = tags;

//     newcard.querySelector('i').id = 'save-' + docID;

//     newcard.querySelector('i').onclick = () => saveBookmark(docID);

//     document.getElementById("quests-go-here").appendChild(newcard);
//     document
//     .getElementById("quests-go-here")
//     .lastElementChild.addEventListener("click", () => {
//         document.location.href = "./eachQuest.html?docID=" + docID;

//     }, true)




// }

// displayCardsDynamically("quests");  //input param is the name of the collection

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





// //------------------------------------------------------------------------------
// // Function to display quests dynamically from Firestore
// // Input parameter: "collection" (name of the Firestore collection to fetch data from)
// //------------------------------------------------------------------------------
// function displayCardsDynamically(collection) {
//     db.collection(collection).get().then(allQuests => {
//         allQuests.forEach(doc => {
//             makeCard(doc); // Call makeCard() for each document
//         });
//     }).catch(error => {
//         console.error("Error fetching quests:", error);
//     });
// }

// //------------------------------------------------------------------------------
// // Function to create a card for each quest
// // Input parameter: "doc" (Firestore document containing quest data)
// //------------------------------------------------------------------------------
// function makeCard(doc) {
//     let cardTemplate = document.getElementById("questCardTemplate");
//     let data = doc.data(); // Get data from Firestore document

//     // Extract fields from the document
//     let title = data.title;
//     let details = data.details;
//     let tags = data.tags || [];
//     let thumbnail = data.thumbnail || './images/Quest.png';
//     let pay = data.pay;
//     let eta = data.estimated_time;
//     let creatorID = data.user_id; // ID of the quest creator
//     let docID = doc.id; // Document ID for the quest

//     // Clone the HTML template for a new card
//     let newCard = cardTemplate.content.cloneNode(true);

//     // Update title, text, and image
//     newCard.querySelector('.card-title').innerHTML = title;
//     newCard.querySelector('.card-text').innerHTML = details;
//     newCard.querySelector('.card-image').src = thumbnail;

//     // Add tags dynamically
//     let tagsContainer = "";
//     tags.forEach(tag => {
//         tagsContainer += `<span style="white-space:pre;background:#c75146;color:white;border-radius:5px;padding:2px 5px;">${tag}</span>&nbsp;`;
//     });
//     newCard.querySelector('.card-tags').innerHTML = tagsContainer;

//     // Add pay and estimated time
//     newCard.querySelector('.card-pay').innerHTML = `$${pay}`;
//     newCard.querySelector('.card-time').innerHTML = `${eta} hour${eta > 1 ? "s" : ""}`;

//     // Fetch the creator's name and update the profile
//     db.collection("users").doc(creatorID).get().then(userDoc => {
//         if (userDoc.exists) {
//             let userName = userDoc.data().name || "Unknown User";
//             newCard.querySelector('.creator-profile').innerHTML = `Created by: <strong>${userName}</strong>`;
//             // Set up bookmark functionality
//             newCard.querySelector('i').id = 'save-' + docID;
//             newCard.querySelector('i').onclick = () => saveBookmark(docID);

//             // Add click functionality for navigation to detailed quest view
//             newCard.addEventListener("click", () => {
//                 document.location.href = "./eachQuest.html?docID=" + docID;
//             });

//             // Append the card to the container
//             document.getElementById("quests-go-here").appendChild(newCard);
//         } else {
//             console.warn(`User with ID ${creatorID} not found.`);
//         }
//     }).catch(error => {
//         console.error("Error fetching creator profile:", error);
//     });


// }

// //------------------------------------------------------------------------------
// // Function to save a quest as a bookmark
// // Input parameter: "questDocID" (ID of the quest to bookmark)
// //------------------------------------------------------------------------------
// function saveBookmark(questDocID) {
//     currentUser.update({
//         bookmarks: firebase.firestore.FieldValue.arrayUnion(questDocID)
//     }).then(() => {
//         console.log("Bookmark saved for quest:", questDocID);
//         let iconID = 'save-' + questDocID;
//         document.getElementById(iconID).innerText = 'bookmark';
//     }).catch(error => {
//         console.error("Error saving bookmark:", error);
//     });
// }

// //
// window.addEventListener("scroll", () => {
//     const button = document.querySelector(".create-quest-button");
//     const footer = document.querySelector("#footerPlaceholder");

//     const footerTop = footer.getBoundingClientRect().top;
//     const viewportHeight = window.innerHeight;

//     if (footerTop < viewportHeight) {
//         button.style.bottom = `${viewportHeight - footerTop + 20}px`;
//     } else {
//         button.style.bottom = "20px";
//     }
// });

// // Call displayCardsDynamically() to display quests from the "quests" collection
// displayCardsDynamically("quests");

//------------------------------------------------------------------------------
// Function to display quests dynamically from Firestore
// Input parameter: "collection" (name of the Firestore collection to fetch data from)
//------------------------------------------------------------------------------
function displayCardsDynamically(collection) {
    db.collection(collection).get().then(allQuests => {
        allQuests.forEach(doc => {
            makeCard(doc); // Call makeCard() for each document
        });
    }).catch(error => {
        console.error("Error fetching quests:", error);
    });
}

//------------------------------------------------------------------------------
// Function to create a card for each quest
// Input parameter: "doc" (Firestore document containing quest data)
//------------------------------------------------------------------------------
function makeCard(doc) {
    let cardTemplate = document.getElementById("questCardTemplate");
    let data = doc.data(); // Get data from Firestore document

    // Extract fields from the document
    let title = data.title;
    let details = data.details;
    let tags = data.tags || [];
    let thumbnail = data.thumbnail || './images/Quest.png';
    let pay = data.pay;
    let eta = data.estimated_time;
    let creatorID = data.user_id; // ID of the quest creator
    let docID = doc.id; // Document ID for the quest

    // Clone the HTML template for a new card
    let newCard = cardTemplate.content.cloneNode(true);

    // Update title, text, and image
    newCard.querySelector('.card-title').innerHTML = title;
    newCard.querySelector('.card-text').innerHTML = details;
    newCard.querySelector('.card-image').src = thumbnail;

    // Add tags dynamically
    let tagsHTML = "";
    tags.forEach(tag => {
        tagsHTML += `<span style="white-space:pre;background:#c75146;color:white;border-radius:5px;padding:2px 5px;">${tag}</span>&nbsp;`;
    });
    newCard.querySelector('.card-tags').innerHTML = tagsHTML;

    // Add pay and estimated time
    newCard.querySelector('.card-pay').innerHTML = `$${pay}`;
    newCard.querySelector('.card-time').innerHTML = `${eta} hour${eta > 1 ? "s" : ""}`;

    // Ensure the `.creator-profile` element exists in the card template
    const creatorProfile = newCard.querySelector('.creator-profile');
    if (creatorProfile) {
        // Fetch the creator's profile and update the profile section
        db.collection("users").doc(creatorID).get().then(userDoc => {
            if (userDoc.exists) {
                let userName = userDoc.data().name || "Unknown User";
                let userPfp = userDoc.data().pfp;

                // Check for null, empty, or invalid profile picture
                if (!userPfp || userPfp.trim() === "") {
                    userPfp = './images/default-avatar.png'; // Fallback to a default profile picture
                }

                // Add the creator's profile with their picture and name
                creatorProfile.innerHTML = `
                    <img src="${userPfp}" alt="Profile Picture" style="width: 30px; height: 30px; border-radius: 50%; margin-right: 8px;">
                    <strong>${userName}</strong>
                `;
            } else {
                console.warn(`User with ID ${creatorID} not found.`);
            }
        }).catch(error => {
            console.error("Error fetching creator profile:", error);
        });
    } else {
        console.error("Error: .creator-profile element is missing in the template.");
    }

    // Add bookmark functionality
    newCard.querySelector('i').id = 'save-' + docID;
    newCard.querySelector('i').onclick = () => saveBookmark(docID);

    // Add click functionality for navigation to detailed quest view
    newCard.addEventListener("click", () => {
        document.location.href = "./eachQuest.html?docID=" + docID;
    });

    // Append the card to the container
    document.getElementById("quests-go-here").appendChild(newCard);
}

//------------------------------------------------------------------------------
// Function to save a quest as a bookmark
//------------------------------------------------------------------------------
function saveBookmark(questDocID) {
    currentUser.update({
        bookmarks: firebase.firestore.FieldValue.arrayUnion(questDocID)
    }).then(() => {
        console.log("Bookmark saved for quest:", questDocID);
        let iconID = 'save-' + questDocID;
        document.getElementById(iconID).innerText = 'bookmark';
    }).catch(error => {
        console.error("Error saving bookmark:", error);
    });
}

//------------------------------------------------------------------------------
// Adjust "Create Quest" button position on scroll
//------------------------------------------------------------------------------
window.addEventListener("scroll", () => {
    const button = document.querySelector(".create-quest-button");
    const footer = document.querySelector("#footerPlaceholder");

    const footerTop = footer.getBoundingClientRect().top;
    const viewportHeight = window.innerHeight;

    if (footerTop < viewportHeight) {
        button.style.bottom = `${viewportHeight - footerTop + 20}px`;
    } else {
        button.style.bottom = "20px";
    }
});

//------------------------------------------------------------------------------
// Display quests from the "quests" Firestore collection
//------------------------------------------------------------------------------
displayCardsDynamically("quests");
