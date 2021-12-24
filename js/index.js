let id = 477795;
const apiKey = '8de2150d7778bff876218c6b8d98f4f0';
fetch(`https://api.openweathermap.org/data/2.5/weather?id=${id}&appid=${apiKey}`)
.then(resp => {
	return resp.json();
})
.then(data => {
    console.log(data);
})
.catch(err => {
	console.error(err);
});