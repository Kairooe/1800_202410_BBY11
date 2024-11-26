var currentUserID;
var base64img;

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
            .map(capitalizeFirstLetter)
            .filter(item => item);
        
        questTitle = document.getElementById('titleInput').value;
        questPay = document.getElementById('rewardInput').value;
        questPayType = document.querySelector('input[name="rewardTypeInput"]:checked').value;
        questETA = document.getElementById('timeInput').value.replace(/[^0-9]/g, '');
        questDetails = document.getElementById('detailsInput').value;
        questThumbnail = base64img;

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
        availability: "Open",
        tags: questTags,
        title: questTitle,
        pay: questPay,
        pay_type: questPayType,
        estimated_time: questETA,
        details: questDetails,
        thumbnail: questThumbnail
    })

    .then(() => {
        alert("Quest created successfully!");
        form.reset(); // Optional: clear the form
    })
    .catch((error) => {
        alert("Error creating quest: " + error.message);
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
const toDataURL = url => fetch(url)
    .then(response => response.blob())
    .then(blob => new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result)
        reader.onerror = reject
        reader.readAsDataURL(blob)
    }))

// was shamelessly stolen from https://stackoverflow.com/questions/42092640/javascript-how-to-reduce-image-to-specific-file-size
// maxDeviation is the difference that is allowed default: 50kb
// Example: targetFileSizeKb = 500 then result will be between 450kb and 500kb
// increase the deviation to reduce the amount of iterations.
async function resizeImage(dataUrl, targetFileSizeKb, maxDeviation = 50) {
    let originalFile = await urltoFile(dataUrl, 'test.png', 'image/png');
    if (originalFile.size / 1000 < targetFileSizeKb)
        return dataUrl; // File is already smaller

    let low = 0.0;
    let middle = 0.5;
    let high = 1.0;

    let result = dataUrl;

    let file = originalFile;

    while (Math.abs(file.size / 1000 - targetFileSizeKb) > maxDeviation) {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        const img = document.createElement('img');

        const promise = new Promise((resolve, reject) => {
            img.onload = () => resolve();
            img.onerror = reject;
        });

        img.src = dataUrl;

        await promise;

        canvas.width = Math.round(img.width * middle);
        canvas.height = Math.round(img.height * middle);
        context.scale(canvas.width / img.width, canvas.height / img.height);
        context.drawImage(img, 0, 0);
        file = await urltoFile(canvas.toDataURL(), 'test.png', 'image/png');

        if (file.size / 1000 < (targetFileSizeKb - maxDeviation)) {
            low = middle;
        } else if (file.size / 1000 > targetFileSizeKb) {
            high = middle;
        }

        middle = (low + high) / 2;
        result = canvas.toDataURL();
    }

    return result;
}
//was shamlessly stolen like thing above
function urltoFile(url, filename, mimeType) {
    return (fetch(url)
            .then(function (res) {
                return res.arrayBuffer();
            })
            .then(function (buf) {
                return new File([buf], filename, {type: mimeType});
            })
    );
}