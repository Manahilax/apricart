const marketDropdown = document.querySelector('.market-dropdown');
const marketButton = document.getElementById('market-main-btn');
const marketOptions = document.querySelectorAll('.market-options button');

// Where each market routes to
const marketDestinations = {
    pakistan: 'pakistan.html',
    ksa: 'ksa.html'
};

marketButton.addEventListener('click', () => {
    marketDropdown.classList.toggle('open');
});

marketOptions.forEach(option => {

    option.addEventListener('click', () => {

        const value = option.dataset.market;
        const destination = marketDestinations[value];

        if (!destination) {
            // No page mapped for this market yet.
            marketDropdown.classList.remove('open');
            return;
        }

        window.location.href = destination;

    });

});

document.addEventListener('click', (e) => {

    if (!marketDropdown.contains(e.target)) {
        marketDropdown.classList.remove('open');
    }

});