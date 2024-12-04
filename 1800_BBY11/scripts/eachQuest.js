var userID;
var currentUser;
function getUser() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            currentUser = db.collection("users").doc(user.uid);
            userID = user.uid
        } else {
            // No user is signed in.
            console.log("No user is logged in");
        }

        getGuild();
    });
}
getUser();

function displayQuestDetailsDynamically(collection, docID) {
    // Reference the HTML elements where data will be inserted
    const titleElement = document.getElementById("quest-title");
    const detailsElement = document.getElementById("quest-details");
    const payElement = document.getElementById("quest-pay");
    const payTypeElement = document.getElementById("quest-pay-type");
    const estimatedTimeElement = document.getElementById("quest-estimated-time");
    const availabilityElement = document.getElementById("quest-availability");
    const tagsElement = document.getElementById("quest-tags");
    const userIdElement = document.getElementById("quest-user-id");
    const thumbnailElement = document.getElementById("quest-thumbnail");

    // Access Firestore collection
    db.collection(collection)
        .doc(docID)
        .get()
        .then((doc) => {
            if (doc.exists) {
                const questData = doc.data();

                // Update HTML content dynamically
                titleElement.textContent = questData.title || "No Title";
                detailsElement.textContent = questData.details || "No Details";
                payElement.textContent = questData.pay || "N/A";
                payTypeElement.textContent = questData.pay_type || "N/A";
                estimatedTimeElement.textContent =
                    questData.estimated_time + ` hour${questData.estimated_time > 1 ? "s" : ""}`;
                availabilityElement.textContent = questData.availability || "Unknown";
                userIdElement.textContent = questData.user_id || "N/A";

                // Handle thumbnail image
                if (!questData.thumbnail) {
                    thumbnailElement.src = `./images/Quest.png`; // Default image
                } else {
                    thumbnailElement.src = questData.thumbnail;
                }

                // Generate tags dynamically
                let tagsHTML = "";
                (questData.tags || []).forEach((tag) => {
                    tagsHTML += `<span style="white-space:pre;background:#c75146;border-radius:10%;display:inline-block;color:white;padding:2px 8px;margin-right:4px;">${tag}</span>`;
                });
                tagsElement.innerHTML = tagsHTML;

                


                if (userID == questData.user_id) {
                    document.getElementById("requestButton").style.display = "none";
                } else {
                    document.getElementById("requestButton").href = "./request.html?docID=" + doc.id;
                }

            } else {
                console.error("No such document found!");
                titleElement.textContent = "Quest not found!";
            }
        })
        .catch((error) => {
            console.error("Error fetching document:", error);
        });
}

// Extract the docID from the URL and call the function
const urlParams = new URLSearchParams(window.location.search);
const questDocID = urlParams.get("docID");

if (questDocID) {
    displayQuestDetailsDynamically("quests", questDocID);
} else {
    console.error("No questDocID provided in the URL.");
    document.getElementById("quest-title").textContent = "No Quest Selected";
}





// Initialize Firestore (make sure Firebase is properly configured in your project)

function displayQuestCreatorDetails(questDocID) {
    // Get reference to Firestore
    const db = firebase.firestore();

    // Fetch the quest document first to get creation details
    db.collection("quests").doc(questDocID).get()
        .then((questDoc) => {
            if (questDoc.exists) {
                const questData = questDoc.data();
                const creatorID = questData.user_id;
                const creationTimestamp = questDoc.get("date_created");

                // Fetch creator's user details
                return db.collection("users").doc(creatorID).get()
                    .then((userDoc) => {
                        // Prepare creator details
                        let userName = "Unknown User";
                        let userPfp = './images/profile-default.jpeg'; // Default profile picture

                        if (userDoc.exists) {
                            const userData = userDoc.data();
                            userName = userData.name || "Unknown User";
                            userPfp = userData.pfp || './images/profile-default.jpeg';
                        }

                        // Format creation date
                        let formattedDate = 'Date Unknown';
                        if (creationTimestamp) {
                            const date = new Date(creationTimestamp);
                            formattedDate = date.toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            });
                        }

                        // Update the creator details container
                        const creatorContainer = document.getElementById('quest-creator-container');
                        if (creatorContainer) {
                            creatorContainer.innerHTML = `
                                <div class="creator-details">
                                    <img src="${userPfp}" 
                                         alt="Profile Picture" 
                                         style="width: 40px; height: 40px; border-radius: 50%; margin-right: 10px;">
                                    <div class="creator-info">
                                        <strong>${userName}</strong>
                                        <p class="text-muted" style="font-size: 0.8em; margin: 0;">Created on ${formattedDate}</p>
                                    </div>
                                </div>
                            `;
                        }
                        
                    });
            }
        })
        .catch((error) => {
            console.error("Error fetching quest creator details:", error);
        });
}

// Modify your existing page load script to call this function
window.addEventListener('load', function() {
    // Get the quest ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const questDocID = urlParams.get("docID");

    if (questDocID) {
        displayQuestCreatorDetails(questDocID);
    }
});