const cardCity = document.querySelectorAll('.card-city'),
	  cardCondition = document.querySelectorAll('.card-condition'),
	  cardInfo = document.querySelectorAll('.card-info'),
	  cardsWeather = document.querySelector('.cards-weather'),
	  inputCity = document.querySelector('.input-city'),
	  cityBtn = document.querySelector('.city-btn');

let cards = document.querySelectorAll('.card');

// let nameCity = 'Устюжна';									// city name
const apiKey = '8de2150d7778bff876218c6b8d98f4f0';				// api key

// Класс создания карточек
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
					<span>${this.cityCondition}</span>
				</div>
				<div class="card-ico">
					<img class="card-img" src="./file/img/img.png" alt="img">
				</div>
				<div class="card-info">
					<span>${this.cityInfo}</span>
				</div>
			</div>
		`;
		cardsWeather.append(div);
		cards = document.querySelectorAll('.card');
		inputCity.value = '';
	}
}

function cardsCreate(city) {
	fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&lang=ru`)
	.then(resp => {
		return resp.json();
	})
	.then(data => {
		//	console.log(data);
		//	cardCity[0].textContent = data.name;
		//	cardInfo[0].textContent = data.weather[0].description;
		//	cardCondition[0].textContent = Math.floor(data.main.temp - 273);

		let [name, description, temp] = [data.name, data.weather[0].description, Math.floor(data.main.temp - 273)];

		console.log(name, description, temp);
		new AddCard(name, temp, description).createCard();
	})
	.catch(err => {
		console.error(err);
	});
};
cardsCreate('Устюжна');

cityBtn.addEventListener('click', citySearch)
inputCity.addEventListener("keydown", (e) => {
	if(e.key == 'Enter') {
		citySearch()
	}
})

// Функция убирает лишние пробелы до и после города, проверяет есть ли в карточках уже такой же город
function citySearch(){
	if(inputCity.value) {
		let city = inputCity.value.replace(/(^\s*)|(\s*$)/g, '');
		let arrCity = document.querySelectorAll('.card-city span');
		let examination = true;
		// console.log(city);
		
		arrCity.forEach((e,i) => {
			// console.log("e:", e.innerText, "i:", i);
			if (city.toLowerCase() == e.innerText.toLowerCase()) {
				examination = false;
				console.log(i);
				cards[i].classList.add('copy')
				setTimeout(() => {
					cards[i].classList.remove('copy')
				}, 1000)
			}
		});

		if (examination){
			// console.log("arrCity: ", arrCity);
			cardsCreate(city);
		}
	}
}