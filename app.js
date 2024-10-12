const searchButton = document.getElementById('searchButton');
const searchInput = document.getElementById('searchInput');
const likesInput = document.getElementById('likesInput');
const resultsDiv = document.getElementById('results');

// Products for different countries
const productsByCountry = {
    TR: [
        { name: "Barbie Dreamhouse (Turkey)", link: "https://www.amazon.com.tr/dp/B07NQYP1WQ", keywords: ["barbie", "doll", "dreamhouse"] },
        { name: "Hot Wheels Track Set (Turkey)", link: "https://www.amazon.com.tr/dp/B07FNN98MD", keywords: ["hot wheels", "cars", "track"] }
    ],
    GB: [
        { name: "Barbie Dreamhouse (UK)", link: "https://www.amazon.co.uk/dp/B07NQYP1WQ", keywords: ["barbie", "doll", "dreamhouse"] },
        { name: "Hot Wheels Track Set (UK)", link: "https://www.amazon.co.uk/dp/B07FNN98MD", keywords: ["hot wheels", "cars", "track"] }
    ]
};

// Function to get user's country using geojs.io
async function getUserCountry() {
    const response = await fetch('https://get.geojs.io/v1/ip/geo.json');
    const data = await response.json();
    return data.country_code;  // Example: 'TR' for Turkey, 'GB' for UK
}

// Function to get country-specific suggestions
async function getCountrySpecificSuggestions(searchTerm, likesTerm) {
    const countryCode = await getUserCountry();  // Detect the user's country
    const countryProducts = productsByCountry[countryCode] || []; // Get the products for the country

    return countryProducts.filter(product => {
        const searchMatch = product.keywords.some(keyword => searchTerm.toLowerCase().includes(keyword));
        const likesMatch = product.keywords.some(keyword => likesTerm.toLowerCase().includes(keyword));
        return searchMatch || likesMatch;
    });
}

// Function to fetch more suggestions
function fetchSuggestions(search, likes) {
    return new Promise((resolve) => {
        // Simulated data fetching
        const suggestions = [
            { name: 'Barbie Dreamhouse', description: 'A beautiful dollhouse for Barbie fans.' },
            { name: 'Hot Wheels Track Set', description: 'An exciting track set for car enthusiasts.' },
            { name: 'LEGO Star Wars', description: 'Build and play with iconic Star Wars scenes.' },
            { name: 'Nerf Blaster', description: 'A fun and safe toy gun for action-packed play.' },
            { name: 'Puzzle Set', description: 'Challenging and fun puzzles for all ages.' },
            { name: 'Board Game', description: 'A classic board game for family fun.' },
            { name: 'Art Supplies', description: 'Everything needed for creative art projects.' },
            { name: 'Science Kit', description: 'Educational and fun science experiments.' },
            { name: 'Stuffed Animal', description: 'A cuddly and cute stuffed animal.' },
            { name: 'RC Car', description: 'A remote-controlled car for thrilling races.' }
        ];

        // Filter suggestions based on search and likes input
        const filteredSuggestions = suggestions.filter(product =>
          product.name.toLowerCase().includes(search.toLowerCase()) ||
          product.description.toLowerCase().includes(likes.toLowerCase())
        );

        resolve(filteredSuggestions);
    });
}

// Function to display results
function displayResults(results) {
    resultsDiv.innerHTML = '';  // Clear previous results

    results.forEach(product => {
        const productElement = document.createElement('div');
        productElement.className = 'product';
        productElement.innerHTML = `
            <h2>${product.name}</h2>
            <p>${product.description}</p>
        `;
        resultsDiv.appendChild(productElement);
    });
}

// Event listener for the search button
searchButton.addEventListener('click', async () => {
    const searchTerm = searchInput.value;
    const likesTerm = likesInput.value;

    const countrySpecificSuggestions = await getCountrySpecificSuggestions(searchTerm, likesTerm);
    const additionalSuggestions = await fetchSuggestions(searchTerm, likesTerm);

    const allSuggestions = [...countrySpecificSuggestions, ...additionalSuggestions];

    displayResults(allSuggestions);
});