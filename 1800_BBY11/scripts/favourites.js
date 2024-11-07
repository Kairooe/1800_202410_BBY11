function addCard(title, description, imageUrl, link) {
    const cardsContainer = document.querySelector('.cards-container');
    const newCard = document.createElement('div');
    newCard.className = 'card';
    newCard.innerHTML = `
        <div class="card-image">
            <img src="${imageUrl}" alt="${title}">
        </div>
        <div class="card-content">
            <div class="card-header">
                <h2 class="card-title">${title}</h2>
                <p class="card-description">${description}</p>
            </div>
            <a href="${link}" class="read-more">Read More</a>
        </div>
    `;
    cardsContainer.appendChild(newCard);
}