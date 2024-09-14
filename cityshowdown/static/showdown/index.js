cities_data = window.cities;
city_names = Object.keys(cities_data);

const lowerButton = document.getElementById("lower-button");
const higherButton = document.getElementById("higher-button");

const populationDiv = document.getElementById('population-text');
const guessedDiv = document.getElementById("guessed-population-text");

const firstCityText = document.getElementById("city1");
const secondCityText = document.getElementById("city2");
const scoreDiv = document.getElementById("score");

const checkmark = document.getElementById('checkmark');
const cross = document.getElementById('cross');
const animationContainer = document.getElementById('animation-container');

let appeared_indexes = [];
let score = 0;

const cityImage1 = document.getElementById("card-image-1");
const cityImage2 = document.getElementById("card-image-2");


document.addEventListener("DOMContentLoaded", async () => {
    let random_index = Math.floor(Math.random() * city_names.length);
    let firstCity = city_names[random_index];
    appeared_indexes.push(random_index);

    random_index = Math.floor(Math.random() * city_names.length);
    let secondCity = city_names[random_index];
    appeared_indexes.push(random_index);

    firstCityText.innerHTML = firstCity;
    secondCityText.innerHTML = secondCity;

    const finalPopulation = cities_data[firstCity];
    animateNumber(populationDiv, 0, finalPopulation, 1000);

    // Set images with loading animation and fade-in effect
    await setCityImage(firstCity, cityImage1, document.getElementById('spinner1'));
    await setCityImage(secondCity, cityImage2, document.getElementById('spinner2'));

    scoreDiv.innerHTML = `Score: ${score}`;

    lowerButton.addEventListener("click", async () => {
        await guessed(secondCity);
        await new Promise(resolve => setTimeout(resolve, 1000));

        if (Number(cities_data[firstCity]) >= Number(cities_data[secondCity])) {
            guessedDiv.style.visibility = "hidden";
            firstCity = secondCity;
            showAnimation('check');
            setTimeout(async () => {
                secondCity = correctGuessed(secondCity);
                await setCityImage(firstCity, cityImage1, document.getElementById('spinner1'));
                await setCityImage(secondCity, cityImage2, document.getElementById('spinner2'));
            }, 2000);
        } else {
            showAnimation('cross');
            setTimeout(() => {
                finishGame(false, score);
            }, 2000);
        }
    });

    higherButton.addEventListener("click", async () => {
        await guessed(secondCity);
        await new Promise(resolve => setTimeout(resolve, 1000));

        if (Number(cities_data[firstCity]) <= Number(cities_data[secondCity])) {
            guessedDiv.style.visibility = "hidden";
            firstCity = secondCity;
            showAnimation('check');
            setTimeout(async () => {
                secondCity = correctGuessed(secondCity);
                await setCityImage(firstCity, cityImage1, document.getElementById('spinner1'));
                await setCityImage(secondCity, cityImage2, document.getElementById('spinner2'));
            }, 2000);
        } else {
            showAnimation('cross');
            setTimeout(() => {
                finishGame(false, score);
            }, 2000);
        }
    });
});

function showAnimation(type) {
    animationContainer.style.pointerEvents = 'auto';

    checkmark.classList.remove('show');
    cross.classList.remove('show');

    if (type === 'check') {
        checkmark.classList.add('show');
    } else if (type === 'cross') {
        cross.classList.add('show');
    }

    setTimeout(() => {
        checkmark.classList.remove('show');
        cross.classList.remove('show');
        animationContainer.style.pointerEvents = 'none';
    }, 1500); 
}

function correctGuessed(secondCity){
    if(appeared_indexes.length == city_names.length-1){
        finishGame(true, score+1);
    }

    score++;
    scoreDiv.innerHTML = `Score: ${score}`;

    let newCity = generateNewCity();
    firstCityText.innerHTML  = secondCity;
    secondCityText.innerHTML  = newCity;
    populationDiv.innerHTML= formatNumber(cities_data[secondCity]);
    lowerButton.style.display = "block";
    higherButton.style.display = "block";
    return newCity;

}

function finishGame(winner, result) {
    document.getElementById("winnerInput").value = winner;
    document.getElementById("resultInput").value = result;

    document.getElementById("resultForm").action = '/result/'; 
    document.getElementById("resultForm").submit();
}

function generateNewCity(){
    let newCityIndex = Math.floor(Math.random() * city_names.length);   
    while (appeared_indexes.includes(newCityIndex)){
        newCityIndex = Math.floor(Math.random() * city_names.length);
    }
    appeared_indexes.push(newCityIndex);
    return city_names[newCityIndex];
}

async function guessed(city) {
    lowerButton.style.display = "none";
    higherButton.style.display = "none";
    guessedDiv.style.visibility = "visible";

    const finalGuessedPopulation = cities_data[city];
    
    // Await the completion of the animation before proceeding
    await animateNumber(guessedDiv, 0, finalGuessedPopulation, 1000);
}

function formatNumber(number) {
    const locale = 'en-US';
    const options = { style: 'decimal', useGrouping: true };
    return new Intl.NumberFormat(locale, options).format(number);
}

function animateNumber(element, start, end, duration) {
    return new Promise((resolve) => {
        let startTimestamp = null;

        function step(timestamp) {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const current = Math.floor(progress * (end - start) + start);
            element.textContent = formatNumber(current);

            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                resolve(); // Resolve the promise when animation is complete
            }
        }

        requestAnimationFrame(step);
    });
}

async function setCityImage(cityName, imageElement, spinnerElement) {
    try {
        spinnerElement.style.display = "block";
        imageElement.style.opacity = 0; 


        const imageUrl = await fetchWikipediaImage(cityName);

        if (imageUrl) {

            const preloadedImage = new Image();
            preloadedImage.src = imageUrl;

            preloadedImage.onload = () => {

                spinnerElement.style.display = "none";
                imageElement.src = preloadedImage.src;
                imageElement.style.opacity = 1; 
            };
        } else {

            spinnerElement.style.display = "none";
            imageElement.src = "/static/showdown/default-city.jpg";
            imageElement.style.opacity = 1; 
        }
    } catch (error) {
        console.error("Error fetching image for city:", cityName, error);
        spinnerElement.style.display = "none";
        imageElement.src = "/static/showdown/default-city.jpg";
        imageElement.style.opacity = 1; 
    }
}


async function fetchWikipediaImage(cityName) {
    const apiUrl = `https://en.wikipedia.org/w/api.php?action=query&origin=*&format=json&prop=pageimages&titles=${encodeURIComponent(cityName)}&piprop=original&formatversion=2`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.query && data.query.pages && data.query.pages.length > 0) {
            const page = data.query.pages[0];
            if (page.original && page.original.source) {
                return page.original.source; 
            }
        }

        return null; 
    } catch (error) {
        console.error("Failed to fetch city image from Wikipedia:", error);
        return null;
    }
}