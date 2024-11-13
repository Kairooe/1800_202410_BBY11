var currentUserID;  

function getUser() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            currentUserID = user.uid;
        } else {
            console.log("No user is signed in");
        }
    });
}
getUser();

function capitalizeFirstLetter(val) {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1).toLowerCase();
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

    try {
        questTagsRaw = document.getElementById('tagInput').value;
        questTags = questTagsRaw.split(" ").map(capitalizeFirstLetter).filter(item => item);
        questTitle = document.getElementById('titleInput').value;
        questPay = document.getElementById('rewardInput').value;
        questPayType = document.querySelector('input[name="rewardTypeInput"]:checked').value;
        questETA = document.getElementById('timeInput').value.replace(/[^0-9]/,'');
        questDetails = document.getElementById('detailsInput').value;

        if (questPayType === 'Money') {
            questPay = questPay.replace(/[^\.0-9]/g,'') + "$";
        } else if (questPayType == "None") {
            questPay = "N/A";
        }
    }
    catch(error) {
        console.log("Whoopsy!", error.message);
        return
    }
    
    db.collection("quests").doc().set({
        user_id: currentUserID,
        date_created: Date.now(),
        availability: "Open",
        tags: questTags,
        title: questTitle,
        pay: questPay,
        pay_type: questPayType,
        estimated_time: questETA,
        details: questDetails
    })
}

function searchQuests() {
    listingsTemplate = document.getElementById("listings");
    questTagsRaw = document.getElementById('tags').value;
    questTags = questTagsRaw.split(" ").map(capitalizeFirstLetter).filter(item => item);

    db.collection("quests").get().then(allQuest => {
            allQuest.forEach(doc => {
                tags = doc.data().tags;
                display = false;
                //alert(display)
                if (tags && !questTags.length) {
                    //alert("tags exist!")
                    display = questTags.every((tag) => tags.includes(tag))
                } else {
                    display = false;
                }
                //alert(display)

                if (display) {
                    let newListing = listingsTemplate.content.cloneNode(true);

                    newListing.querySelector('.titleAhh').innerHTML = doc.data().title;
                    newListing.querySelector('.detailsAhh').innerHTML = doc.data().details;
                    newListing.querySelector('.eachQuestAhh').innerHTML = `Go to ${db.collection("users").get(doc.data().user_id).name}'s quest!`;
                    newListing.querySelector('.eachQuestAhh').href = `eachQuest.html?docID=${doc.id}`;

                    document.getElementById("lista").appendChild(newListing)

                }
            })
        })
}
