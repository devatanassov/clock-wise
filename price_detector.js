// function contains(selector) {
//   var elements = document.body.querySelectorAll(selector);
//   console.log(elements);
//   return Array.prototype.filter.call(elements, function (element) {
//     const rg = new RegExp("d+s*d+(.d{2})?", "g");
//     return rg.test(element.textContent);
//   });
// }

// console.log("Name", contains("span")[0]); // rmeove [0] to get more than one

//WIP
let priceDetector = {
  priceTags: ["span", "div", "p"],
  regEx: new RegExp("d+s*d+(.d{2})?", "g"),
  detect: () => {
    let priceElements = [];
    priceDetector.priceTags.map((tag) => {
      var elements = document.body.querySelectorAll(tag);
      return Array.prototype.filter.call(elements, function (element) {
        return priceDetector.regEx.test(element.textContent);
      });
    });
  },
};
