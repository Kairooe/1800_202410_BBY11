document.addEventListener("DOMContentLoaded", function () {
    // Example data for job cards
    const jobData = [
        {
            title: "Quest 1",
            image: "https://via.placeholder.com/150",
            tags: "Adventure, Exploration",
            time: "2 hours",
            pay: "$50",
            description: "Explore the nearby cave and collect rare gems.",
            href: "#",
        },
        {
            title: "Quest 2",
            image: "https://via.placeholder.com/150",
            tags: "Combat, Strategy",
            time: "1 hour",
            pay: "$30",
            description: "Defend the village from invading goblins.",
            href: "#",
        },
        {
            title: "Quest 3",
            image: "https://via.placeholder.com/150",
            tags: "Puzzle, Intelligence",
            time: "3 hours",
            pay: "$100",
            description: "Solve the ancient temple's mysteries.",
            href: "#",
        },
    ];

    // Get the template and the container
    const template = document.getElementById("questCardTemplate");
    const jobCardsContainer = document.getElementById("jobCardsContainer");

    // Populate the container with cards
    jobData.forEach((job) => {
        const card = template.content.cloneNode(true);

        card.querySelector(".card-title").textContent = job.title;
        card.querySelector(".card-image").src = job.image;
        card.querySelector(".card-tags").textContent = job.tags;
        card.querySelector(".card-time").textContent = job.time;
        card.querySelector(".card-pay").textContent = job.pay;
        card.querySelector(".card-text").textContent = job.description;
        card.querySelector(".card-href").href = job.href;

        jobCardsContainer.appendChild(card);
    });
});
