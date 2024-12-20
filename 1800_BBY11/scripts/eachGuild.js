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

var urlParams;
var questDocID;
var guildRef;
var guildDoc;

function getGuild() {
    urlParams = new URLSearchParams(window.location.search);
    questDocID = urlParams.get("docID");
    if (!questDocID) {
        document.querySelector(".container").innerHTML = "<h1>No Guild Selected.</h1>";
        return
    }

    db.collection("guilds").doc(questDocID).get().then((doc) => {
        guildDoc = doc;
        guildRef = db.collection("guilds").doc(questDocID);
        if (!doc.exists) {
            document.querySelector(".container").innerHTML = "<h1>Guild does not exist.</h1>";
            return
        }
        if (!doc.data().public && (doc.data().owner != userID && (!doc.data().members && doc.data().members.length == 0 && !doc.data().members.includes(userID)))) {
            document.querySelector(".container").innerHTML = `<h1>Sorry, you do not have access to this private board.</h1>`;
            return
        }

        if (doc.data().owner != userID) {
            hideOwnerOptions();
        }

        if (doc.data().public) {
            document.querySelectorAll(".displayIfPrivate").forEach((elem) => {
                elem.style.display = "none";
            })
        } else {
            getMembers(doc)
        }
        if (doc.data().thumbnail != null && doc.data().thumbnail != "") {
            document.getElementById("guildImg").src = doc.data().thumbnail;
        }

        document.querySelector("title").innerHTML = doc.data().name;
        document.getElementById("guildName").innerHTML = doc.data().name;
        document.getElementById("guildDesciption").innerHTML = doc.data().description;
    }).catch(
    )

    displayCardsDynamically();

}

function getMembers(guildDoc) {
    members = guildDoc.data().members;

    db.collection("users").doc(guildDoc.data().owner).get().then((ownerDoc) => {
        displayMember(ownerDoc, true)
        if (members) {
            members.forEach((memberID) => {
                db.collection("users").doc(memberID).get().then((memberDoc) => {
                    displayMember(memberDoc)
                })
            })
        }
    })

}

function displayMember(memberDoc, isOwner) {
    let memberTemplate = document.getElementById("memberTemplate");
    newcard = memberTemplate.content.cloneNode(true)

    pfp = memberDoc.data().pfp

    if (pfp == null || pfp == "") {
        pfp = "./images/iconamoon--profile-fill.png";
    }

    newcard.querySelector(".thingimg").src = pfp
    if (isOwner) {
        newcard.querySelector(".thingimg").style.borderColor = "#967e3c";
        newcard.querySelector(".thingimg").style.borderStyle = "double";
        newcard.querySelector(".thingimg").style.borderWidth = "4px";
    }
    document.getElementById("guildMembers").appendChild(newcard);
    document
    .getElementById("guildMembers")
    .lastElementChild.addEventListener("click", () => {
        document.location.href = "./profile.html?docID=" + memberDoc.id;
    })


}


function displayCardsDynamically() {
    let cardTemplate = document.getElementById("questCardTemplate"); // Retrieve the HTML element with the ID "hikeCardTemplate" and store it in the cardTemplate variable. 

    db.collection("quests").get()   //the collection called "quests"
        .then(allQuest => {
            //var i = 1;  //Optional: if you want to have a unique ID for each hike
            allQuest.forEach(doc => { //iterate thru each doc
                console.log(doc.data().guild + " " + questDocID)
                if (doc.data().guild != questDocID) {
                    return
                }
                if (doc.data().availability != "Open") {
                    return
                }

                title = doc.data().title;       // get value of the "name" key
                details = doc.data().details;  // get value of the "details" key
                questTags = doc.data().tags;
                date = doc.data().date_created;
                thumbnail = doc.data().thumbnail;
                docID = doc.id;
                creatorID = doc.data().user_id; // ID of the quest creator
                newcard = cardTemplate.content.cloneNode(true); // Clone the HTML template to create a new card (newcard) that will be filled with Firestore data.



                //update title and text and image
                newcard.querySelector('.card-title').innerHTML = title;
                newcard.querySelector('.card-text').innerHTML = details;
                if (!thumbnail) {
                    newcard.querySelector('.card-image').src = `./images/Quest.png`;

                } else {
                    newcard.querySelector('.card-image').src = thumbnail;
                }


                let tags = ""
                questTags.forEach((val) => {
                    tags += `<span style="white-space:pre;background:#c75146;border-radius:10%;display:inline-block">  ${val}  </span><span style="white-space:pre;">  </span>`
                })

                let eta = doc.data().estimated_time

                newcard.querySelector('.card-pay').innerHTML = doc.data().pay
                newcard.querySelector('.card-time').innerHTML = doc.data().estimated_time + ` hour${eta > 1 ? "s" : ""}`;

                newcard.querySelector('.card-tags').innerHTML = tags;

                //newcard.querySelector('i').id = 'save-' + docID;   //guaranteed to be unique

                //newcard.querySelector('i').onclick = () => saveBookmark(docID);

                let creatorProfile = newcard.querySelector('.creator-profile');

                db.collection("users").doc(doc.data().user_id).get().then(userDoc => {
                    let userName = userDoc.data().name || "Unknown User";
                    let userPfp = userDoc.data().pfp;

                    creatorProfile.innerHTML = `
                    <img src="${userPfp}" alt="Profile Picture" style="width: 30px; height: 30px; border-radius: 50%; margin-right: 8px;">
                    <strong>${userName}</strong>
                    `;

                    document.getElementById("guildQuests").appendChild(newcard);

                    document
                    .getElementById("guildQuests")
                    .lastElementChild.addEventListener("click", () => {
                        document.location.href = "./eachQuest.html?docID=" + doc.id;
                    })
                    })


                //Optional: give unique ids to all elements for future use
                // newcard.querySelector('.card-title').setAttribute("id", "ctitle" + i);
                // newcard.querySelector('.card-text').setAttribute("id", "ctext" + i);
                // newcard.querySelector('.card-image').setAttribute("id", "cimage" + i);

                //attach to gallery, Example: "hikes-go-here"
                
            })
        })
}





function hideOwnerOptions() {
    document.querySelectorAll(".ownerThings").forEach(elem => {
        elem.style.display = "none";
    })
}


function addUser() {
    let userID = document.getElementById("userInput").value;

    let members = guildDoc.data().members;
    if (!members || members.length == 0) {
        members = [userID];
    } else if (members.length != 0 && !members.includes(userID)) {
        members.push(userID)
    }

    guildRef.set({
        members: members
    }, { merge: true });
    
}

function removeUser() {
    let userID = document.getElementById("userInput").value;

    let members = guildDoc.data().members;
    if (members && members.length != 0 && members.includes(userID)) {
        members.splice(members.indexOf(userID), 1);
    }

    guildRef.set({
        members: members
    }, { merge: true });
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