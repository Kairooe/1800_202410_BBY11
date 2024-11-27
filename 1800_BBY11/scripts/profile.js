
var currentUser;               //points to the document of the user who is logged in

function populateUserInfo() {
    firebase.auth().onAuthStateChanged(user => {
        // Check if user is signed in:
        if (user) {

            //go to the correct user document by referencing to the user uid
            currentUser = db.collection("users").doc(user.uid)
            //get the document for current user.
            populateQuestData()
            currentUser.get()
                .then(userDoc => {
                    //get the data fields of the user
                    let userName = userDoc.data().name;
                    let pfp = userDoc.data().pfp;

                    //if the data fields are not empty, then write them in to the form.
                    if (userName != null) {

                        document.getElementById("user-name").innerHTML = userName;
                    }

                    if (pfp != null && pfp != "") {
                        document.getElementById("profile-picture").src = pfp;
                    }

                })
        } else {
            // No user is signed in.
            console.log("No user is signed in");
        }
    });
}

populateUserInfo();


document.getElementById("profile-picture").addEventListener("click", () => {
    document.getElementById("pfp-upload").click()
})

window.addEventListener('load', function () {
    document.getElementById('pfp-upload').addEventListener('change', function () {
        if (this.files && this.files[0]) {
            resizeImage(URL.createObjectURL(this.files[0]), 500).then((data) => {
                toDataURL(data).then(base64img => {
                    document.getElementById("profile-picture").src = base64img;
                    currentUser.set({
                        pfp: base64img
                    }, { merge: true });
                })

            })
        }

    });
});





function populateQuestData() {
    currentUser.get().then(userDoc => {
        userDoc.data().quests_created.map(element => questIDToCard(element, "postedQuestsContainer"))
        userDoc.data().quests_taken.map(element => questIDToCard(element, "takenQuestsContainer"))
        userDoc.data().quests_watched.map(element => questIDToCard(element, "watchedQuestsContainer"))
        userDoc.data().quests_completed.map(element => questIDToCard(element, "historyQuestsContainer"))
    })
}

function questIDToCard(element, id) {
    db.collection("quests").doc(element).onSnapshot(questDoc => {

        card = document.getElementById("questCardTemplate").content.cloneNode(true);

        title = questDoc.data().title;       // get value of the "name" key
        details = questDoc.data().details;  // get value of the "details" key
        questTags = questDoc.data().tags;
        date = questDoc.data().date_created;
        thumbnail = questDoc.data().thumbnail;
        docID = questDoc.id;

        card.querySelector('.card-title').innerHTML = title;
        card.querySelector('.card-text').innerHTML = details;
        if (!thumbnail) {
            card.querySelector('.card-image').src = `./images/Quest.png`;

        } else {
            card.querySelector('.card-image').src = thumbnail;
        }


        let tags = ""
        questTags.forEach((val) => {
            tags += `<span style="white-space:pre;background:#c75146;border-radius:10%;display:inline-block">  ${val}  </span><span style="white-space:pre;">  </span>`
        })

        let eta = questDoc.data().estimated_time

        card.querySelector('.card-pay').innerHTML = questDoc.data().pay
        card.querySelector('.card-time').innerHTML = questDoc.data().estimated_time + ` hour${eta > 1 ? "s" : ""}`;

        card.querySelector('.card-tags').innerHTML = tags;

        card.querySelector('a').href = "eachQuest.html?docID=" + docID;
        card.querySelector('i').id = 'save-' + docID;   //guaranteed to be unique

        card.querySelector('i').onclick = () => saveBookmark(docID);


        document.getElementById(id).appendChild(card);

    })


}

