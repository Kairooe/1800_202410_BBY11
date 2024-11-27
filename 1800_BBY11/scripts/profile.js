
var currentUser;               //points to the document of the user who is logged in

function populateUserInfo() {
    firebase.auth().onAuthStateChanged(user => {
        // Check if user is signed in:
        if (user) {

            //go to the correct user document by referencing to the user uid
            currentUser = db.collection("users").doc(user.uid)
            //get the document for current user.
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
                    },{ merge: true});
                })
                
            })  
        }
        
    });
});

