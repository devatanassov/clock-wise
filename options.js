const elements = {
  form: document.getElementById("clock-form"),
  rateType: document.getElementById("rateType"), //perMonth/hour
  rate: document.getElementById("rate"), //actualValuePerRate
  currency: document.getElementById("currency"),
};

var rateService = {
  hoursInMonth: 160, //40 hours a week times 4 weeks
  hoursInDay: 8, //8 hours a day
  rateInCentsPerHour: null,
  calculateRateInCentsPerHour: (rateType, rate) => {
    if ("monthly" === String(rateType)) {
      rateService.rateInCentsPerHour =
        rateService.calculateFromMonthlyRate(rate);
    }

    if ("hourly" === String(rateType)) {
      rateService.rateInCentsPerHour = Math.round(parseFloat(rate) * 100);
    }

    if ("daily" === String(rateType)) {
      rateService.rateInCentsPerHour = rateService.calculateFromDailyRate(rate);
    }
  },
  calculateFromMonthlyRate: (rate) => {
    let rateInCents = Math.round(parseFloat(rate) * 100);
    let rateInCentsPerHour = Math.round(
      parseFloat(rateInCents / rateService.hoursInMonth)
    );
    return rateInCentsPerHour;
  },

  calculateFromDailyRate: (rate) => {
    let rateInCents = Math.round(parseFloat(rate) * 100);
    let rateInCentsPerHour = Math.round(
      parseFloat(rateInCents / rateService.hoursInDay)
    );
    return rateInCentsPerHour;
  },
  calculateTimeByPrice: (price) => {
    if (rateService.rateInCentsPerHour === null) {
      return false;
    }

    priceInCents = Math.round(parseFloat(price) * 100);

    priceInHours = priceInCents / rateService.rateInCentsPerHour;

    const representations = [
      { unit: "seconds", value: 1 },
      { unit: "minutes", value: 60 },
      { unit: "hours", value: 3600 },
      { unit: "days", value: 28800 }, //86400 }, //this needs to be considered 8 working hours
      { unit: "weeks", value: 144000 }, //604800 }, //this needs to be considered 8 working hours times 5 working days
      { unit: "months", value: 576000 }, //2419200 }, //this needs to be considered 8 working hours times 5 working days times 4 weeks (lame)
      { unit: "years", value: 6912000 }, //29030400 }, //this needs to be considered 8 working hours times 5 working days times 4 weeks times 12 months
    ];
    let compileResult = "";
    let priceInSeconds = priceInHours * 60 * 60;
    representationsReveresed = representations.reverse();
    for (i in representationsReveresed) {
      unitCount = Math.floor(priceInSeconds / representations[i].value);
      if (unitCount == 0) {
        continue;
      }
      compileResult +=
        unitCount +
        " " +
        (unitCount === 1
          ? representations[i].unit.substring(
              0,
              representations[i].unit.length - 1
            )
          : representations[i].unit) +
        ",";
      priceInSeconds -= unitCount * representations[i].value;
      continue;
    }
    console.log(compileResult);
  },
};

const initOptions = (el) => {
  Object.keys(currencies).map((currencyIndex) => {
    myOption = document.createElement("option");
    myOption.text =
      currencies[currencyIndex].currency +
      "(" +
      currencies[currencyIndex].symbol +
      ")";
    myOption.value = currencies[currencyIndex].abbreviation;
    el.appendChild(myOption);
  });

  // TODO add symbol to options
  // const number = 123456.78;

  // console.log(
  //   new Intl.NumberFormat("en-IN", {
  //     style: "currency",
  //     currency: "INR",
  //   }).format(number)
  // );
};

initOptions(elements.currency);

elements.form.addEventListener("submit", (event) => {
  event.preventDefault();
  let data = {
    rateType: elements.rateType.value,
    rate: elements.rate.value,
    currency: elements.currency.value,
  };

  chrome.storage.sync.set({ userData: data }, function () {
    console.log("Value is set to " + data.rateType);
  });

  // chrome.storage.sync.get("userData", (userData) => {
  //   console.log(userData);
  // });
});

let page = document.getElementById("buttonDiv");
let selectedClassName = "current";
const presetButtonColors = ["#3aa757", "#e8453c", "#f9bb2d", "#4688f1"];

// Reacts to a button click by marking the selected button and saving
// the selection
function handleButtonClick(event) {
  // Remove styling from the previously selected color
  let current = event.target.parentElement.querySelector(
    `.${selectedClassName}`
  );
  if (current && current !== event.target) {
    current.classList.remove(selectedClassName);
  }

  // Mark the button as selected
  let color = event.target.dataset.color;
  event.target.classList.add(selectedClassName);
  chrome.storage.sync.set({ color });
}

// Add a button to the page for each supplied color
function constructOptions(buttonColors) {
  chrome.storage.sync.get("color", (data) => {
    let currentColor = data.color;
    // For each color we were provided…
    for (let buttonColor of buttonColors) {
      // …create a button with that color…
      let button = document.createElement("button");
      button.dataset.color = buttonColor;
      button.style.backgroundColor = buttonColor;

      // …mark the currently selected color…
      if (buttonColor === currentColor) {
        button.classList.add(selectedClassName);
      }

      // …and register a listener for when that button is clicked
      button.addEventListener("click", handleButtonClick);
      page.appendChild(button);
    }
  });
}

// Initialize the page by constructing the color options
constructOptions(presetButtonColors);
