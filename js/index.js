const cardCity = document.querySelectorAll('.card-city'),
	  cardCondition = document.querySelectorAll('.card-condition'),
	  cardInfo = document.querySelectorAll('.card-info'),
	  cardsWeather = document.querySelector('.cards-weather'),
	  inputCity = document.querySelector('.input-city'),
	  cityBtn = document.querySelector('.city-btn'),
	  body = document.querySelector('body');

let cards = document.querySelectorAll('.card');

const apiKey = '8de2150d7778bff876218c6b8d98f4f0';				// api key

// Класс создания карточек
class AddCard {
	constructor (cityName, cityCondition, cityInfo, cityIcon, id) {
		this.cityName = cityName;
		this.cityCondition = cityCondition;
		this.cityInfo = cityInfo;
		this.cityIcon = cityIcon;
		this.id = id;
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
				<div class="card-ico">
					<img class="card-img" src='http://openweathermap.org/img/wn/${this.cityIcon}.png' alt="weather-icon">
				</div>
				<div class="card-info">
					<span>${this.cityInfo}</span>
				</div>
			</div>
		`;

		div.querySelector('.container').append(divClose);
		
		divClose.addEventListener('click', () => {
			div.parentNode.removeChild(div)
		});

		cardsWeather.append(div);

		inputCity.value = '';

		localStorage.setItem(this.id, this.cityName);
	}
}

function createModal(code='',message='') {
	const modal = document.createElement('div');
	modal.classList.add('modal');
	modal.innerHTML =`
		<div class="modal-window">
			<div class="modal-title">
				<h4>Warning</h4>
			</div>
			<div class="modal-text">
				<div class="modal-code">${code}</div>
				<div class="modal-message">${message}</div>
			</div>
		</div>
	`
	modal.addEventListener('dblclick', (element) => {
		//console.log(element.target);
		modal.parentNode.removeChild(modal)
	})
	body.append(modal);

	inputCity.blur()
}

function checkLocalStorage() {
	if (localStorage.length > 0) {
		Object.values(localStorage).forEach(e => cardsCreate(e))
	} else {
		cardsCreate('Устюжна');
	}
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
				let [name, description, temp, icon, id] = [data.name, data.weather[0].description, Math.floor(data.main.temp - 273), data.weather[0].icon, data.id];
				// console.log(name, " , ", description, " , ", temp, " , ", icon);
				new AddCard(name, temp, description, icon, id).createCard();
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
				createModal('1', "Такой город уже есть")
			} else {
				console.error('Error NONE');
			}
		}

		//console.log('data: ', data);
	})
	.catch(err => {
		console.error('error: ', err);
	});
};

// cityBtn.addEventListener('click', citySearch)

inputCity.addEventListener("keydown", (event) => {
	if(event.key == 'Enter') {
		// citySearch()
		let city = inputCity.value.replace(/(^\s*)|(\s*$)/g, '');
		cardsCreate(city)
	}
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