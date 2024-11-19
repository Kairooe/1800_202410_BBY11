function getNameFromAuth() {
    firebase.auth().onAuthStateChanged(user => {
        // Check if a user is signed in:
        if (user) {
            // Do something for the currently logged-in user here: 
            console.log(user.uid); //print the uid in the browser console
            console.log(user.displayName);  //print the user name in the browser console
            userName = user.displayName;

            //method #1:  insert with JS
            //document.getElementById("name-goes-here").innerText = userName;    

            //method #2:  insert using jquery
            //$("#name-goes-here").text(userName); //using jquery

            //method #3:  insert using querySelector
            document.querySelector("#name-goes-here").innerText = userName

        } else {
            // No user is signed in.
            console.log("No user is logged in");
        }
    });
}
getNameFromAuth(); //run the function


// Function to read the quote of the day from the Firestore "quotes" collection
// Input param is the String representing the day of the week, aka, the document name
function readQuote(day) {
    db.collection("quotes").doc(day)                                                         //name of the collection and documents should matach excatly with what you have in Firestore
        .onSnapshot(dayDoc => {                                                              //arrow notation
            console.log("current document data: " + dayDoc.data());                          //.data() returns data object
            document.getElementById("quote-goes-here").innerHTML = dayDoc.data().quote;      //using javascript to display the data on the right place

            //Here are other ways to access key-value data fields
            //$('#quote-goes-here').text(dayDoc.data().quote);         //using jquery object dot notation
            //$("#quote-goes-here").text(dayDoc.data()["quote"]);      //using json object indexing
            //document.querySelector("#quote-goes-here").innerHTML = dayDoc.data().quote;

        }, (error) => {
            console.log("Error calling onSnapshot", error);
        });
}
readQuote("tuesday");        //calling the function

function writeQuest() {
    //define a variable for the collection you want to create in Firestore to populate data
    var questsRef = db.collection("quests");

    questsRef.add({
        code: "01",
        name: "Lawn Mowing", //replace with your own city?
        city: "Burnaby",
        province: "BC",
        level: "easy",
        details: "Mow my lawn for 50$",
        last_updated: firebase.firestore.FieldValue.serverTimestamp()  //current system time
    });
    questsRef.add({
        code: "02",
        name: "Dog Walking", //replace with your own city?
        city: "Anmore",
        province: "BC",
        level: "moderate",
        details: "Golden Doodle need walking around 3pm for 40$",
        last_updated: firebase.firestore.Timestamp.fromDate(new Date("March 10, 2022"))
    });
    questsRef.add({
        code: "03",
        name: "Gardening", //replace with your own city?
        city: "North Vancouver",
        province: "BC",
        level: "hard",
        details: "I need some labor help in my garden for 80$",
        last_updated: firebase.firestore.Timestamp.fromDate(new Date("January 1, 2023"))
    });
}


//------------------------------------------------------------------------------
// Input parameter is a string representing the collection we are reading from
//------------------------------------------------------------------------------
function displayCardsDynamically(collection) {
    let cardTemplate = document.getElementById("questCardTemplate"); // Retrieve the HTML element with the ID "hikeCardTemplate" and store it in the cardTemplate variable. 

    db.collection(collection).get()   //the collection called "quests"
        .then(allQuest => {
            //var i = 1;  //Optional: if you want to have a unique ID for each hike
            allQuest.forEach(doc => { //iterate thru each doc
                var title = doc.data().name;       // get value of the "name" key
                var details = doc.data().details;  // get value of the "details" key
                var code = doc.data().code;
                var docID = doc.id;
                let newcard = cardTemplate.content.cloneNode(true); // Clone the HTML template to create a new card (newcard) that will be filled with Firestore data.
                
                

                //update title and text and image
                newcard.querySelector('.card-title').innerHTML = title;
                newcard.querySelector('.card-text').innerHTML = details;
                newcard.querySelector('.card-image').src = `./images/${code}.jpg`; //Example: NV01.jpg
                
                newcard.querySelector('a').href = "eachQuest.html?docID="+docID;
                newcard.querySelector('i').id = 'save-' + docID;   //guaranteed to be unique

                newcard.querySelector('i').onclick = () => saveBookmark(docID);

              

                
                //Optional: give unique ids to all elements for future use
                // newcard.querySelector('.card-title').setAttribute("id", "ctitle" + i);
                // newcard.querySelector('.card-text').setAttribute("id", "ctext" + i);
                // newcard.querySelector('.card-image').setAttribute("id", "cimage" + i);

                //attach to gallery, Example: "hikes-go-here"
                document.getElementById(collection + "-go-here").appendChild(newcard);

                //i++;   //Optional: iterate variable to serve as unique ID
            })
        })
}

displayCardsDynamically("quests");  //input param is the name of the collection

function saveBookmark(questDocID) {
    // Manage the backend process to store the questDocID in the database, recording which hike was bookmarked by the user.
    currentUser.update({
        // Use 'arrayUnion' to add the new bookmark ID to the 'bookmarks' array.
        // This method ensures that the ID is added only if it's not already present, preventing duplicates.
        bookmarks: firebase.firestore.FieldValue.arrayUnion(questDocID)
    })
        // Handle the front-end update to change the icon, providing visual feedback to the user that it has been clicked.
        .then(function () {
            console.log("bookmark has been saved for" + questDocID);
            let iconID = 'save-' + questDocID;
            //console.log(iconID);
            //this is to change the icon of the hike that was saved to "filled"
            document.getElementById(iconID).innerText = 'bookmark';
        });
}

function updateBookmark(questDocID) {
    //  alert("Inside update Bookmark");

    currentUser.get().then(doc => {
        console.log(doc.data());
        currentBookmarks = doc.data().bookmarks;

        if (currentBookmarks && currentBookmarks.includes(questDocID)) {
            console.log(questDocID);
            currentUser.update({
                bookmarks: firebase.firestore.FieldValue.arrayRemovw(questDocID),
            })
                .then(function () {
                    console.log("The Bookmark is removed for" + currentUser);
                    let iconID = "save-" + questDocID;
                    comsole.log(iconID);
                    document.getElementById(iconID);
                    document.getElementById(iconID).innerText = "bookemar_border";
                })
        } else {
            currentUser.set({
                bookmarks: firebaseConfig.firestore.FieldValue.arrayUnion(questDocID),
            },
                {
                    merge: true
                })
                .then(function () {
                    console.log("The Bookmark is removed for" + currentUser);
                    let iconID = "save-" + questDocID;
                    comsole.log(iconID);
                    document.getElementById(iconID).innerText = "bookemark";
                })



        }
    })
}
