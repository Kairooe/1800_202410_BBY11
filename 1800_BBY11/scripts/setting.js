// Firebase Initialization (Assumes Firebase is already initialized in your project)
const storage = firebase.storage();
const firestore = firebase.firestore();
const auth = firebase.auth();

// Reference to form and input elements
const profileEditForm = document.getElementById("profileEditForm");
const resumeUpload = document.getElementById("resumeUpload");
const saveProfile = document.getElementById("saveProfile");

// Handle Save Profile Button Click
saveProfile.addEventListener("click", async () => {
    const user = auth.currentUser;
    if (!user) {
        alert("You must be logged in to edit your profile.");
        return;
    }

    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const bio = document.getElementById("bio").value;
    const resumeFile = resumeUpload.files[0];

    if (resumeFile && resumeFile.type !== "application/pdf") {
        alert("Please upload a valid PDF file.");
        return;
    }

    try {
        // Update profile data in Firestore
        const userDocRef = firestore.collection("users").doc(user.uid);
        await userDocRef.set(
            {
                username: username,
                email: email,
                bio: bio,
            },
            { merge: true }
        );

        // Upload resume to Firebase Storage if file is provided
        if (resumeFile) {
            const storageRef = storage.ref(`resumes/${user.uid}/${resumeFile.name}`);
            const uploadTask = await storageRef.put(resumeFile);

            // Get the download URL for the resume
            const resumeURL = await uploadTask.ref.getDownloadURL();

            // Save the resume URL in Firestore
            await userDocRef.set(
                {
                    resumeURL: resumeURL,
                },
                { merge: true }
            );

            alert("Profile and resume saved successfully!");
        } else {
            alert("Profile saved successfully!");
        }
    } catch (error) {
        console.error("Error saving profile:", error);
        alert("An error occurred while saving your profile. Please try again.");
    }
});
