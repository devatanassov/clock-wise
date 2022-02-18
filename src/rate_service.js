export default () => {
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
        rateService.rateInCentsPerHour =
          rateService.calculateFromDailyRate(rate);
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

      var priceInCents = Math.round(parseFloat(price) * 100);

      var priceInHours = priceInCents / rateService.rateInCentsPerHour;

      const workingTimeSchema = [
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
      var representationsReveresed = workingTimeSchema.reverse();
      for (var i in representationsReveresed) {
        var unitCount = Math.floor(priceInSeconds / workingTimeSchema[i].value);
        if (unitCount == 0) {
          continue;
        }
        compileResult +=
          unitCount +
          " " +
          (unitCount === 1
            ? workingTimeSchema[i].unit.substring(
                0,
                workingTimeSchema[i].unit.length - 1
              )
            : workingTimeSchema[i].unit) +
          ",";
        priceInSeconds -= unitCount * workingTimeSchema[i].value;
        continue;
      }

      return compileResult;
    },
  };

  return rateService;
};
