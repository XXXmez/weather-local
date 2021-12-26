const cards = document.querySelectorAll('.card'),
	  cardCity = document.querySelectorAll('.card-city'),
	  cardCondition = document.querySelectorAll('.card-condition'),
	  cardInfo = document.querySelectorAll('.card-info'),
	  cardsWeather = document.querySelector('.cards-weather');

let nameCity = 'Устюжна';									// city name
const apiKey = '8de2150d7778bff876218c6b8d98f4f0';			// api key

fetch(`https://api.openweathermap.org/data/2.5/weather?q=${nameCity}&appid=${apiKey}&lang=ru`)
.then(resp => {
	return resp.json();
})
.then(data => {
    console.log(data);
	cardCity[0].textContent = data.name;
	cardInfo[0].textContent = data.weather[0].description;
	cardCondition[0].textContent = Math.floor(data.main.temp - 273);
})
.catch(err => {
	console.error(err);
});

// 
class AddCard {
	constructor (cityName, cityCondition, cityInfo) {
		this.cityName = cityName;
		this.cityCondition = cityCondition;
		this.cityInfo = cityInfo;

	}

	createCard () {
		const div = document.createElement('div');
		div.classList.add('card');
		div.innerHTML = `
			<div class="container">
				<div class="card-city">
					<span>${this.cityName}</span>
				</div>
				<div class="card-condition">
					<span>${cityCondition}</span>
				</div>
				<div class="card-ico">
					<img class="card-img" src="./file/img/img.png" alt="img">
				</div>
				<div class="card-info">
					<span>${cityInfo}</span>
				</div>
			</div>
		`;
		cardsWeather.append(div);
	}
}

function cardsCreate(city) {
	fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&lang=ru`)
	.then(resp => {
		return resp.json();
	})
	.then(data => {
		console.log(data);
		cardCity[0].textContent = data.name;
		cardInfo[0].textContent = data.weather[0].description;
		cardCondition[0].textContent = Math.floor(data.main.temp - 273);
	})
	.catch(err => {
		console.error(err);
	});
	}
//cardsCreate('Устюжна');