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


function getGuild() {
    const urlParams = new URLSearchParams(window.location.search);
    const questDocID = urlParams.get("docID");
    if (!questDocID) {
        document.querySelector(".container").innerHTML = "<h1>No Guild Selected.</h1>";
        return
    }

    db.collection("guilds").doc(questDocID).get().then((doc) => {
        if (!doc.exists) {
            document.querySelector(".container").innerHTML = "<h1>Guild does not exist.</h1>";
            return
        }
        if (!doc.data().public && (doc.data().owner != userID || (!doc.data().members || doc.data().members.includes(userID)))) {
            document.querySelector(".container").innerHTML = `<h1>Sorry, you do not have access to this private board.</h1>`;
            return
        }

        document.getElementById("guildName").innerHTML = doc.data().name;
    }).catch(
    )

}