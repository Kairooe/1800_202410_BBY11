// function displayQuestInfo() {
//     let params = new URL( window.location.href ); //get URL of search bar
//     let ID = params.searchParams.get( "docID" ); //get value for key "id"
//     console.log(ID);

//     // doublecheck: is your collection called "Reviews" or "reviews"?
//     db.collection("quests")
//         .doc(ID)
//         .get()
//         .then(doc => {
//             thisName = doc.data().name;
//             code = doc.data().code;
//             details = doc.data().details;
            
//             // only populate title, and image
//             document.getElementById( "questName" ).innerHTML = thisName;
//             let imgEvent = document.querySelector( ".quest-img" );
//             imgEvent.src = "./images/"+ code + ".jpg";
//             document.querySelector(".quest-details").innerHTML = details;

//         } );
        
// }
// displayQuestInfo();
// /*
// // function saveHikeDocumentIDAndRedirect(){
// //     let params = new URL(window.location.href) //get the url from the search bar
// //     let ID = params.searchParams.get("docID");
// //     localStorage.setItem('hikeDocID', ID);
// //     window.location.href = 'request.html';
// // }

// */
// // function populateReviews() {
// //     console.log("test");
// //     let hikeCardTemplate = document.getElementById("reviewCardTemplate");
// //     let hikeCardGroup = document.getElementById("reviewCardGroup");

// //     let params = new URL(window.location.href); // Get the URL from the search bar
// //     let hikeID = params.searchParams.get("docID");

// //     // Double-check: is your collection called "Reviews" or "reviews"?
// //     db.collection("reviews")
// //         .where("hikeDocID", "==", hikeID)
// //         .get()
// //         .then((allReviews) => {
// //             reviews = allReviews.docs;
// //             console.log(reviews);
// //             reviews.forEach((doc) => {
// //                 var title = doc.data().title;
// //                 var level = doc.data().level;
// //                 var season = doc.data().season;
// //                 var description = doc.data().description;
// //                 var flooded = doc.data().flooded;
// //                 var scrambled = doc.data().scrambled;
// //                 var time = doc.data().timestamp.toDate();
// //                 var rating = doc.data().rating; // Get the rating value
// //                 console.log(rating)

// //                 console.log(time);

// //                 let reviewCard = hikeCardTemplate.content.cloneNode(true);
// //                 reviewCard.querySelector(".title").innerHTML = title;
// //                 reviewCard.querySelector(".time").innerHTML = new Date(
// //                     time
// //                 ).toLocaleString();
// //                 reviewCard.querySelector(".level").innerHTML = `Level: ${level}`;
// //                 reviewCard.querySelector(".season").innerHTML = `Season: ${season}`;
// //                 reviewCard.querySelector(".scrambled").innerHTML = `Scrambled: ${scrambled}`;
// //                 reviewCard.querySelector(".flooded").innerHTML = `Flooded: ${flooded}`;
// //                 reviewCard.querySelector( ".description").innerHTML = `Description: ${description}`;

// //                 // Populate the star rating based on the rating value
                
// // 	              // Initialize an empty string to store the star rating HTML
// // 								let starRating = "";
// // 								// This loop runs from i=0 to i<rating, where 'rating' is a variable holding the rating value.
// //                 for (let i = 0; i < rating; i++) {
// //                     starRating += '<span class="material-icons">star</span>';
// //                 }
// // 								// After the first loop, this second loop runs from i=rating to i<5.
// //                 for (let i = rating; i < 5; i++) {
// //                     starRating += '<span class="material-icons">star_outline</span>';
// //                 }
// //                 reviewCard.querySelector(".star-rating").innerHTML = starRating;

// //                 hikeCardGroup.appendChild(reviewCard);
// //             });
// //         });
// // }
// /*
// populateReviews();
// */

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
