import getRateService from "./rate_service.js";
let state = {
  serviceInitiated: false,
  userDataLoaded: false,
  userData: null,
};
var rateService = getRateService();
let conversionForm = document.getElementById("converstionForm");

chrome.storage.sync.get("userData", function (data) {
  if (
    data.hasOwnProperty("userData") &&
    data.userData.hasOwnProperty("rateType") &&
    data.userData.hasOwnProperty("rate") &&
    data.userData.hasOwnProperty("currency")
  ) {
    state.userDataLoaded = true;
    state.userData = data.userData;
    rateService.calculateRateInCentsPerHour(
      data.userData.rateType,
      data.userData.rate
    );
    state.serviceInitiated = true;
  } else {
    console.log(data);
  }
});

conversionForm.addEventListener("submit", (event) => {
  event.preventDefault();
  var price = document.getElementById("rate").value;
  if (state.userDataLoaded && state.serviceInitiated) {
    var letformatetTime = rateService.calculateTimeByPrice(price);
    document.getElementById("timeToPay").innerHTML = letformatetTime;
  }
  // chrome.storage.sync.get("userData", (userData) => {
  //   console.log(userData);
  // });
});
