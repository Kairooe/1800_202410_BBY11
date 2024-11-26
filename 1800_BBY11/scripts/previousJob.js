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

document.addEventListener("DOMContentLoaded", function () {
    // Example data for quests posted by the user
    const postedQuestsData = [
        {
            title: "Post 1",
            image: "https://via.placeholder.com/150",
            tags: "Adventure, Mystery",
            time: "5 hours",
            pay: "$150",
            description: "Embark on a thrilling adventure to uncover hidden treasures.",
            href: "#",
        },
        {
            title: "Post 2",
            image: "https://via.placeholder.com/150",
            tags: "Combat, Action",
            time: "3 hours",
            pay: "$120",
            description: "Join forces to fight off a band of raiders threatening the town.",
            href: "#",
        },
        {
            title: "Post 3",
            image: "https://via.placeholder.com/150",
            tags: "Puzzle, Exploration",
            time: "2 hours",
            pay: "$80",
            description: "Solve the puzzles guarding the ancient ruins.",
            href: "#",
        },
    ];

    // Get the template and the container for posted quests
    const postedQuestsTemplate = document.getElementById("questPostedCardTemplate");
    const postedQuestsContainer = document.getElementById("postedQuestsContainer");

    // Populate the container with quest cards
    postedQuestsData.forEach((quest) => {
        const card = postedQuestsTemplate.content.cloneNode(true);

        card.querySelector(".card-title").textContent = quest.title;
        card.querySelector(".card-image").src = quest.image;
        card.querySelector(".card-tags").textContent = quest.tags;
        card.querySelector(".card-time").textContent = quest.time;
        card.querySelector(".card-pay").textContent = quest.pay;
        card.querySelector(".card-text").textContent = quest.description;
        card.querySelector(".card-href").href = quest.href;

        postedQuestsContainer.appendChild(card);
    });
});

