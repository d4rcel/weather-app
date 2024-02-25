const wrapper =  document.querySelector('.wrapper'),
inputPart = wrapper.querySelector('.input-part'),
infoText = inputPart.querySelector('.info-txt'),
inputField = inputPart.querySelector('input'),
locationButton = inputPart.querySelector('button'),
weatherIcon = wrapper.querySelector('.weather-part img'),
arrowBack = wrapper.querySelector('header i');

const apiKey = '797adc7aac3f01f875b71e30e2bf718b';

let api;

inputField.addEventListener('keyup', e =>{
    if(e.key == 'Enter' && inputField.value != ''){
        requestApi(inputField.value);
    }
});

locationButton.addEventListener('click', () => {
    if(navigator.geolocation){ // if navigator support geolocation
        navigator.geolocation.getCurrentPosition(onSuccess, onError)
    } else {
        alert('Your browser not support geolocation api');
    }
});

function onSuccess(position){
    const {latitude, longitude} = position.coords ;// getting lat an long of the user device coords obj
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
    fetchData();
}

function onError(error){
    infoText.innerText = error.message;
    infoText.classList.add('error');
}

function requestApi(city) {
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    fetchData();
}

function fetchData(){
    infoText.innerText = 'Getting weather details...';
    infoText.classList.add('pending');
    // getting api response and returning it with into js obj and in another
    // then function calling weatherDetails function with passing api result as an argument
    fetch(api).then(response => response.json()).then(result => weatherDetails(result));
}

function weatherDetails(info) {
    if(info.cod == '404') {
        infoText.classList.replace('pending', 'error');
        infoText.innerText = `${inputField.value} is not a valid city name`;
    } else {
        // lets get required value from info object
        const city = info.name;
        const country = info.sys.country;
        const {description, id} = info.weather[0];
        const {feels_like, humidity, temp} = info.main;

        // using custom icon according to the id which api return us
        if(id === 800) {
            weatherIcon.src = 'icons/clear.svg';
        }else if(id >= 200 && id <= 232) {
            weatherIcon.src = 'icons/storm.svg';
        }else if(id >= 600 && id <= 622) {
            weatherIcon.src = 'icons/snow.svg';
        }else if(id >= 701 && id <= 781) {
            weatherIcon.src = 'icons/haze.svg';
        }else if(id >= 801 && id <= 804) {
            weatherIcon.src = 'icons/cloud.svg';
        }else if((id >= 300 && id <= 321) ||(id >= 500 && id <= 531) ) {
            weatherIcon.src = 'icons/rain.svg';
        }

        //lets pass these values to a particular html element
        wrapper.querySelector('.temp .numb').innerText = Math.floor(temp);
        wrapper.querySelector('.weather').innerText = description;
        wrapper.querySelector('.location span').innerText = `${city}, ${country}`;
        wrapper.querySelector('.temp .numb-2').innerText = Math.floor(feels_like);
        wrapper.querySelector('.humidity span').innerText =`${humidity}%`;
        infoText.classList.remove('pending', 'error');
        wrapper.classList.add('active');
    }
    
}

arrowBack.addEventListener('click', () =>{
    wrapper.classList.remove('active');
})