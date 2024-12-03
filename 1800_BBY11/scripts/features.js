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

function addHashtag(val) {
    return "#" + val.toLowerCase().replace(' ', "");
}

function saveTag() {
    tagName = document.getElementById('tagNameInput').value;
    tagCategory = document.getElementById('tagCategoryInput').value;

    db.collection("tags").doc().set({
        name: tagName,
        category: tagCategory
    })
}


function createQuest() {
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
        questTagsRaw = document.getElementById('tagInput').value;
        // Split by comma, trim whitespace, capitalize first letters, remove empty tags
        questTags = questTagsRaw.split(',')
            .map(tag => tag.trim())
            .map(addHashtag)
            .filter(item => item);
        
        questTitle = document.getElementById('titleInput').value;
        questPay = document.getElementById('rewardInput').value;
        questPayType = document.querySelector('input[name="rewardTypeInput"]:checked').value;
        questETA = document.getElementById('timeInput').value.replace(/[^0-9]/g, '');
        questDetails = document.getElementById('detailsInput').value;
        questThumbnail = base64img;
        questGuild = document.getElementById('guilds').value;

        if (questPayType === 'Money') {
            questPay =  "$" + questPay.replace(/[^\.0-9]/g, '') ;
        } else if (questPayType == "None") {
            questPay = "Volunteering";
        }
    }
    catch (error) {
        console.log("Whoopsy!", error.message);
        return
    }
    
    if (!base64img) {
        base64img = "";
    }
    

    db.collection("quests").doc().set({
        user_id: currentUserID,
        date_created: Date.now(),
        guild: questGuild,
        availability: "Open",
        tags: questTags,
        title: questTitle,
        pay: questPay,
        pay_type: questPayType,
        estimated_time: questETA,
        details: questDetails,
        thumbnail: questThumbnail
    })

    .then((docRef) => {
        currentUserID.get().then(userDoc => {
            userDoc.data().quests_created.push(docRef.id)
        })
        form.reset(); // Optional: clear the form
    })

    Swal.fire({
        title: "Quest created successfully!",
        icon: "success",
        confirmButtonText: "Go Home",
        customClass: {
            confirmButton: 'swal2-confirm',
        }
    }).then((result) => {
        if (result.isConfirmed) {  // Check if the confirm button was clicked
            window.location.href = "main.html";  // Redirect to main.html
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

//was shamelessly stolen from https://stackoverflow.com/questions/6150289/how-can-i-convert-an-image-into-base64-string-using-javascript
