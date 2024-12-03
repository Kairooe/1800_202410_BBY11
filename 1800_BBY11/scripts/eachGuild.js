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

function getGuild() {
    urlParams = new URLSearchParams(window.location.search);
    questDocID = urlParams.get("docID");
    if (!questDocID) {
        document.querySelector(".container").innerHTML = "<h1>No Guild Selected.</h1>";
        return
    }

    db.collection("guilds").doc(questDocID).get().then((doc) => {
        if (!doc.exists) {
            document.querySelector(".container").innerHTML = "<h1>Guild does not exist.</h1>";
            return
        }
        if (!doc.data().public && (doc.data().owner != userID && (!doc.data().members || doc.data().members.includes(userID)))) {
            document.querySelector(".container").innerHTML = `<h1>Sorry, you do not have access to this private board.</h1>`;
            return
        }

        if (doc.data().public) {
            document.querySelectorAll(".displayIfPrivate").forEach((elem) => {
                elem.style.display = "none";
            })
        } else {
            getMembers(doc)
        }

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

    newcard.querySelector(".thingimg").src = memberDoc.data().pfp
    if (isOwner) {
        newcard.querySelector(".thingimg").style.borderColor = "#967e3c";
        newcard.querySelector(".thingimg").style.borderStyle = "double";
        newcard.querySelector(".thingimg").style.borderWidth = "4px";
    }
    document.getElementById("guildMembers").appendChild(newcard);

    document.getElementById("guildMembers").lastElementChild.addEventListener("click", () => {
        document.location.href = "./profile.html?docID="+memberDoc.id;
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

                title = doc.data().title;       // get value of the "name" key
                details = doc.data().details;  // get value of the "details" key
                questTags = doc.data().tags;
                date = doc.data().date_created;
                thumbnail = doc.data().thumbnail;
                docID = doc.id;
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

                newcard.querySelector('a').href = "eachQuest.html?docID=" + docID;
                newcard.querySelector('i').id = 'save-' + docID;   //guaranteed to be unique

                newcard.querySelector('i').onclick = () => saveBookmark(docID);

                


                //Optional: give unique ids to all elements for future use
                // newcard.querySelector('.card-title').setAttribute("id", "ctitle" + i);
                // newcard.querySelector('.card-text').setAttribute("id", "ctext" + i);
                // newcard.querySelector('.card-image').setAttribute("id", "cimage" + i);

                //attach to gallery, Example: "hikes-go-here"
                document.getElementById("guildQuests").appendChild(newcard);

                //i++;   //Optional: iterate variable to serve as unique ID
            })
        })
}
