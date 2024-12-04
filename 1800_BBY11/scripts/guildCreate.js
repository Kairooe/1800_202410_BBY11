var currentUserID;
var base64img;

function getUser() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            currentUserID = user.uid;

            guildHolder = document.getElementById("guilds");
            db.collection("guilds").get().then((allGuilds) => {
                allGuilds.forEach((guildDoc) => {
                    option = document.createElement("option");

                    option.innerHTML = guildDoc.data().name;
                    option.value = guildDoc.id;

                    guildHolder.appendChild(option);
                    
                })
                
            })
        } else {
            console.log("No user is signed in");
        }
    });
}
getUser();


function createGuild() {
    if (!currentUserID) {
        return
    }

    // Get the form element
    const form = document.querySelector('form');
    
    // Check if form is valid
    if (!form.checkValidity()) {
        // Trigger browser's default validation UI
        form.reportValidity();
        return;
    }

    try {
        questName = document.getElementById('nameInput').value;
        questDetails = document.getElementById('detailsInput').value;
        questThumbnail = base64img;
    }
    catch (error) {
        console.log("Whoopsy!", error.message);
        return
    }
    
    if (!base64img) {
        base64img = "";
    }
    

    db.collection("guilds").doc().set({
        owner: currentUserID,
        description: questDetails,
        thumbnail: questThumbnail,
        members: null,
        public: false,
        name: questName
    })

    .then((docRef) => {
        currentUserID.get().then(userDoc => {
            userDoc.data().quests_created.push(docRef.id)
        })
        form.reset(); // Optional: clear the form
    })

    Swal.fire({
        title: "Guild created successfully!",
        icon: "success",
        confirmButtonText: "Go back to guilds",
        customClass: {
            confirmButton: 'swal2-confirm',
        }
    }).then((result) => {
        if (result.isConfirmed) {  // Check if the confirm button was clicked
            window.location.href = "./guild.html";  // Redirect to main.html
        }
    });
}

function searchQuests() {
    document.getElementById("lista").innerHTML = "";
    listingsTemplate = document.getElementById("listings");
    questTagsRaw = document.getElementById('tags').value;
    questTags = questTagsRaw.split(" ").map(capitalizeFirstLetter).filter(item => item);

    db.collection("quests").get().then(allQuest => {
        allQuest.forEach(doc => {
            tags = doc.data().tags;
            display = false;
            if (tags && questTags.length) {
                display = questTags.every((tag) => tags.includes(tag))
            } else if (!questTags.length) {
                display = true;
            }

            if (display) {

                let newListing = listingsTemplate.content.cloneNode(true);

                newListing.querySelector('.titleAhh').innerHTML = doc.data().title;
                newListing.querySelector('.detailsAhh').innerHTML = doc.data().details;
                newListing.querySelector('.eachQuestAhh').innerHTML = `Inspect quest!`;
                newListing.querySelector('.eachQuestAhh').href = `eachQuest.html?docID=${doc.id}`;


                document.getElementById("lista").appendChild(newListing)


            }

        })
    })
}


//was shamelessly stolen from https://stackoverflow.com/questions/22087076/how-to-make-a-simple-image-upload-using-javascript-html
window.addEventListener('load', function () {
    document.getElementById('thumbnail').addEventListener('change', function () {
        if (this.files && this.files[0]) {
            var img = document.getElementById('myImg');
            img.onload = () => {
                toDataURL(img.src).then(dataUrl => {
                    resizeImage(dataUrl, 500).then((data) => {
                        base64img = data;
                    })
                })

                URL.revokeObjectURL(img.src);
            }

            img.src = URL.createObjectURL(this.files[0]);
        }
    });
});

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

//was shamelessly stolen from https://stackoverflow.com/questions/6150289/how-can-i-convert-an-image-into-base64-string-using-javascript
