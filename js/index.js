const cardCity = document.querySelectorAll('.card-city'),
	  cardCondition = document.querySelectorAll('.card-condition'),
	  cardInfo = document.querySelectorAll('.card-info'),
	  cardsWeather = document.querySelector('.cards-weather'),
	  inputCity = document.querySelector('.input-city'),
	  cityBtn = document.querySelector('.city-btn'),
	  body = document.querySelector('body');

const apiKey = '8de2150d7778bff876218c6b8d98f4f0';				// api key

// Класс создания карточек
class AddCard {
	constructor (cityName, cityCondition, cityInfo, cityIcon, id, feelsLike, humidity, speed) {
		this.cityName = cityName;
		this.cityCondition = cityCondition;
		this.cityInfo = cityInfo;
		this.cityIcon = cityIcon;
		this.id = id;
		this.feelsLike = feelsLike;
		this.humidity = humidity;
		this.speed = speed;
	}

	createCard () {
		const div = document.createElement('div'),
			divClose = document.createElement('div');

		div.classList.add('card');
		divClose.classList.add('card-close');

		divClose.innerHTML = `<span>Close</span>`;
		div.innerHTML = `
			<div class="container">
				<div class="card-city">
					<span>${this.cityName}</span>
				</div>
				<div class="card-condition">
					<span>${this.cityCondition}° C</span>
				</div>
				<div class="card-feels-like">
					<span>Feels like </span><span>${this.feelsLike}° C</span>
				</div>
				<div class="card-humidity">
					<span>Humidity </span><span>${this.humidity}%</span>
				</div>
				<div class="card-wind">
					<span>Wind </span><span>${this.speed} m/s</span>
				</div>
				<div class="card-ico">
					<img class="card-img" src='http://openweathermap.org/img/wn/${this.cityIcon}.png' alt="weather-icon">
				</div>
				<div class="card-info">
					<span>${this.cityInfo}</span>
				</div>
			</div>
		`;

		div.querySelector('.container').append(divClose);
		
		divClose.addEventListener('click', (e) => {
			deletelocal(this.cityName);
			div.parentNode.removeChild(div)
		});

		cardsWeather.append(div);

		inputCity.value = '';

		savelocal(this.cityName)
	}
}

function createModal(code='',message='') {
	const modal = document.createElement('div');
	modal.classList.add('modal');
	modal.innerHTML =`
		<div class="modal-window">
			<div class="modal-title">
				<h4>Warning</h4>
				<div class="modal-close"><svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 26 26" width="26px" height="26px"><path d="M 21.734375 19.640625 L 19.636719 21.734375 C 19.253906 22.121094 18.628906 22.121094 18.242188 21.734375 L 13 16.496094 L 7.761719 21.734375 C 7.375 22.121094 6.746094 22.121094 6.363281 21.734375 L 4.265625 19.640625 C 3.878906 19.253906 3.878906 18.628906 4.265625 18.242188 L 9.503906 13 L 4.265625 7.761719 C 3.882813 7.371094 3.882813 6.742188 4.265625 6.363281 L 6.363281 4.265625 C 6.746094 3.878906 7.375 3.878906 7.761719 4.265625 L 13 9.507813 L 18.242188 4.265625 C 18.628906 3.878906 19.257813 3.878906 19.636719 4.265625 L 21.734375 6.359375 C 22.121094 6.746094 22.121094 7.375 21.738281 7.761719 L 16.496094 13 L 21.734375 18.242188 C 22.121094 18.628906 22.121094 19.253906 21.734375 19.640625 Z"/></svg></div>
			</div>
			<div class="modal-text">
				<div class="modal-code">${code}</div>
				<div class="modal-message">${message}</div>
			</div>
		</div>
	`
	body.append(modal);
	const modalClose = document.querySelector('.modal-close');
	modalClose.addEventListener('click', () => {
		modal.parentNode.removeChild(modal)
	})

	inputCity.blur()
}

function checkLocalStorage() {
	if (localStorage.getItem('saveLocal') == null) {
		cardsCreate('Sevastopol');
	} else {
		localStorage.getItem('saveLocal').split(',').forEach(e => cardsCreate(e));
	}
}

function savelocal(local){
	if (localStorage.getItem('saveLocal') == null) {
		localStorage.setItem('saveLocal', local)
	} else if (localStorage.getItem('saveLocal') && localStorage.getItem('saveLocal').split(',').indexOf(local) < 0) {
		const arrSaveLocal = [];
		arrSaveLocal.push(localStorage.getItem('saveLocal'), local);
		localStorage.setItem('saveLocal', arrSaveLocal);
	}
}

function deletelocal(local){
	const newArrSaveLocal = [...localStorage.getItem('saveLocal').split(',')];
	newArrSaveLocal.splice(localStorage.getItem('saveLocal').split(',').indexOf(local), 1);
	localStorage.setItem('saveLocal', newArrSaveLocal)
	if(localStorage.getItem('saveLocal') == '') localStorage.removeItem('saveLocal');
}

function cardsCreate(city) {
	fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&lang=en`)
	.then(resp => {
		return resp.json();
	})
	.then(data => {
		// console.log(data);
		const list = document.querySelectorAll('.card-city span');
		const listArray = Array.from(list);

		function addL() {
			if (data.cod == 200) {
				let [name, description, temp, icon, id, feelsLike, humidity, speed] = [data.name, data.weather[0].description, Math.floor(data.main.temp - 273), data.weather[0].icon, data.id, Math.floor(data.main.feels_like - 273), data.main.humidity, data.wind.speed];
				new AddCard(name, temp, description, icon, id, feelsLike, humidity, speed).createCard();
			} else {
				//console.log(data.cod, data.message);
				createModal(data.cod, data.message)
			}
		}
		
		if (list.length == 0) {
			addL()
		} else {
			const seachElem = listArray.filter(e => {
				return e.innerText == data.name;
			})
			if (seachElem.length == 0) {
				addL()
			} else if (seachElem.length > 0) {
				createModal('1', "This city already exists")
			} else {
				console.error('Error NONE');
			}
		}
	})
	.catch(err => {
		console.error('error: ', err);
	});
};

function citySearch(){
	let city = inputCity.value.replace(/(^\s*)|(\s*$)/g, '');
	cardsCreate(city)
}

inputCity.addEventListener("keydown", (event) => {
	if(event.key == 'Enter') {
		citySearch()
	}
})
cityBtn.addEventListener('click', () => {
	citySearch()
})

checkLocalStorage()









































// Функция убирает лишние пробелы до и после города, проверяет есть ли в карточках уже такой же город
// function citySearch(){
// 	if(inputCity.value) {
// 		let city = inputCity.value.replace(/(^\s*)|(\s*$)/g, '');
// 		let arrCity = document.querySelectorAll('.card-city span');
// 		let examination = true;
// 		// console.log(city);
		
// 		arrCity.forEach((e,i) => {
// 			// console.log("e:", e.innerText, "i:", i);
// 			if (city.toLowerCase() == e.innerText.toLowerCase()) {
// 				examination = false;
// 				console.log(i);
// 				cards[i].classList.add('copy')
// 				setTimeout(() => {
// 					cards[i].classList.remove('copy')
// 				}, 1000)
// 			}
// 		});

// 		if (examination){
// 			// console.log("arrCity: ", arrCity);
// 			cardsCreate(city);
// 		}
// 	}
// }