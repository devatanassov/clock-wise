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
  priceTags: ["span", "div", "a"],
  regEx: new RegExp("\\d+\\s*\\d+([\\.|,]\\d{2})?", "g"),
  detect: () => {
    let priceElements = [];
    priceDetector.priceTags.map((tag) => {
      var elements = document.body.querySelectorAll(tag);
      var filteredElementsByTag = Array.prototype.filter.call(
        elements,
        function (element) {
          if (priceDetector.regEx.test(element.textContent)) {
            console.log(element.textContent);
          }

          return priceDetector.regEx.test(element.textContent);
        }
      );
      // console.log(elements);
      // elements[0].map((el) => console.log(el.textContent));
    });
  },
};
priceDetector.detect();

const rg = new RegExp("\\d+\\s*\\d+([\\.|,]\\d{2})?", "g");
const leafRegEx = new RegExp("^\\s*[0-9]+([\\.|,|\\s]{0,1}[0-9]*)*s*$", "g");
const ignorredTags = ["SPAN", "SUP"];
let priceElements = [];
let chilldCandidates = [];
function detect(element = null) {
  if (element === null) {
    element = document.body;
  }
  var debug = element.tagName == "SPAN";
  //contains price
  if (rg.test(element.textContent)) {
    //yes
    if (debug) {
      console.log("Match the rehex: " + element.textContent);
    }

    if (false == element.hasChildNodes()) {
      //has children - no
      if (debug) {
        console.log("Has no children: " + element.textContent);
      }
      if (leafRegEx.test(element.textContent)) {
        priceElements.push([element.textContent, element]);
        return true;
      }

      return false;
    } else {
      chilldCandidates = Array.prototype.slice.call(element.childNodes);
      var validChild = [];
      chilldCandidates.map((childNode) => {
        if (debug) {
          console.log(
            detect(childNode),
            false == ignorredTags.includes(childNode.tagName)
          );
        }
        if (detect(childNode)) {
          validChild.push(childNode);
        }
      });

      if (
        validChild.length === 0 &&
        false === ignorredTags.includes(element.tagName)
      ) {
        priceElements.push([element.textContent, element]);
        return true;
      } else {
        return false;
      }
    }
  } else {
    return false;
  }
}
detect();
console.log(priceElements);
/*
detect(element)
test element text
if has price get children
if no children - add current elemnt as containing price
if children - iterrate over them and call recursivly detect(children)
*/
