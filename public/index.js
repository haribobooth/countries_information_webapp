var appendElements = function(){
  for(var i = 0; i < (arguments.length-1); i++){
    var child = arguments[i];
    var parent = arguments[i + 1];
    parent.appendChild(child)
  }
};

var makeRequest = function(url, callback){
  var request = new XMLHttpRequest();

  request.open('GET', url);
  request.onload = callback;
  request.send();
};

var populateSelect = function(){
  if(this.status !== 200) return;
  var jsonString = this.responseText;
  var countries = JSON.parse(jsonString);

  populateList(countries);
};

var populateList = function(countries){
  var countryList = document.querySelector('#country-list');
  countries.forEach(function(country){
    addCountry(countryList, country);
  });

  var countryName = countryList.value;
  var restUrl = "https://restcountries.eu/rest/v1/name/" + countryName;

  makeRequest(restUrl, displayDetails);
};

var addCountry = function(list, country){
  var savedPrevName = loadCountry('previous').name;
  var option = document.createElement('option');
  if(savedPrevName === country.name){option.selected = 'selected'};
  option.innerText = country.name;
  option.value = country.name;
  list.appendChild(option);
};

var showCountryDetails = function(){
  var countrySelect = document.querySelector('#country-list');
  var selectedCountry = countrySelect.value;
  var restUrl = "https://restcountries.eu/rest/v1/name/" + selectedCountry;

  makeRequest(restUrl, displayDetails);
};

var saveCountry = function(key, value){
  var jsonValue = JSON.stringify(value);
  localStorage.setItem(key, jsonValue);
};

var loadCountry = function(key){
  var jsonValue = localStorage.getItem(key);
  var value = JSON.parse(jsonValue);
  return value;
};

var displayDetails = function(){
  var detailsContainer = document.querySelector('#country-details');
  var prevDetails = document.querySelectorAll('#country-details *');

  prevDetails.forEach(function(element){
      detailsContainer.removeChild(element);
  });

  if(this.status !== 200) return;
  var jsonString = this.responseText;
  var country = JSON.parse(jsonString)[0];

  saveCountry('previous', country);

  var nameHeading = document.createElement('h2');
  var populationP = document.createElement('p');
  var capitalCityP = document.createElement('p');

  nameHeading.innerText = "Name: " + country.name;
  populationP.innerText = "Population: " + country.population;
  capitalCityP.innerText = "Capital City: " + country.capital;

  appendElements(nameHeading, detailsContainer);
  appendElements(populationP, detailsContainer);
  appendElements(capitalCityP, detailsContainer);
};

var app = function(){
  var url = "https://restcountries.eu/rest/v1";
  var countrySelect = document.querySelector('#country-list');

  makeRequest(url, populateSelect);
  countrySelect.onchange = showCountryDetails;
};

window.onload = app;
