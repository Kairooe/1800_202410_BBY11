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
    
    // Add bookmark functionality
    newCard.querySelector('i').id = 'save-' + docID;
    newCard.querySelector('i').onclick = () => saveBookmark(docID);

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
                    userPfp = './images/profile-default.jpeg'; // Fallback to a default profile picture
                }
                // Add the creator's profile with their picture and name
                creatorProfile.innerHTML = `
                    <img src="${userPfp}" alt="Profile Picture" style="width: 30px; height: 30px; border-radius: 50%; margin-right: 8px;">
                    <strong>${userName}</strong>
                `;
                // Add click functionality for navigation to detailed quest view
                newCard.addEventListener("click", () => {
                    document.location.href = "./eachQuest.html?docID=" + docID;
                });

                // Append the card to the container
                document.getElementById("quests-go-here").appendChild(newCard);

                document
                    .getElementById("quests-go-here")
                    .lastElementChild.addEventListener("click", () => {
                        document.location.href = "eachQuest.html?docID=" + docID;
                    });
            } else {
                console.warn(`User with ID ${creatorID} not found.`);
            }
        }).catch(error => {
            console.error("Error fetching creator profile:", error);
        });
    } else {
        console.error("Error: .creator-profile element is missing in the template.");
    }









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
