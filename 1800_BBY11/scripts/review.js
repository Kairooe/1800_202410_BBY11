const urlParams = new URLSearchParams(window.location.search);
const questDocID = urlParams.get("docID");
var userID;
var currentUser;
var questDoc;
var questRef;


function getUser() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            currentUser = db.collection("users").doc(user.uid);
            userID = user.uid
        } else {
            // No user is signed in.
            console.log("No user is logged in");
        }
    });
}
getUser();

function putQuestName() {
    questRef = db.collection("quests").doc(questDocID).get()
    questRef.then(doc => {
        questDoc = doc;
        document.getElementById("questName").innerHTML = questDoc.data().title;

        db.collection("users").doc(questDoc.data().user_id).get().then(userDoc => {
            document.getElementById("questCreator").innerHTML = userDoc.data().name;
        })

    })
}

putQuestName()



function apply() {

}
