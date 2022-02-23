let getPath = (path) => {
  return chrome.runtime.getURL(path);
};
console.log(
  getPath("assets/bootstrap-5.1.3-dist/icons-main/icons/clock-history.svg")
);

const exContent = {
  priceIcon: getPath(
    "assets/bootstrap-5.1.3-dist/icons-main/icons/clock-history.svg"
  ),
  bootStrapCss: getPath("assets/bootstrap-5.1.3-dist/css/bootstrap.min.css"),
  bootStrapJS: getPath(
    "assets/bootstrap-5.1.3-dist/js/bootstrap.bundle.min.js"
  ),
};
//load js
// var script = document.createElement("script");
// script.src = exContent.bootStrapJS;
// document.head.appendChild(script); //or something of the likes

// //load css
// var css = ".leftmenu {@include '" + exContent.bootStrapCss + "';}";
// var head = document.head || document.getElementsByTagName("head")[0];
// var style = document.createElement("style");

// head.appendChild(style);
// if (style.styleSheet) {
//   // This is required for IE8 and below.
//   style.styleSheet.cssText = css;
// } else {
//   style.appendChild(document.createTextNode(css));
// }

const leafRegEx = new RegExp("^\\s*[1-9]+([\\.|,|\\s]{0,1}[0-9]*)*s*$", "g");
const ignoredTags = ["BUTTON", "SUP"];
var prices = [];
function scan_dom(depth = 0, node = document.body, detectPrice) {
  if (typeof node.tagName == "undefined") {
    return;
  }
  // console.log("-".repeat(depth) + node.tagName);

  if (
    leafRegEx.test(node.textContent) &&
    false == ignoredTags.includes(node.tagName)
  ) {
    detectPrice([node.textContent, node]);
  }

  if (node.hasChildNodes()) {
    depth++;
    tagChildren = Array.prototype.slice.call(node.childNodes);
    tagChildren.map((childNode) => {
      scan_dom(depth, childNode, detectPrice);
    });
  }
}

chrome.storage.sync.get("userData", function (data) {
  console.log(data);
  if (data.hasOwnProperty("userData")) {
    if (
      data.userData.hasOwnProperty("scanPages") &&
      data.userData.scanPages === true
    ) {
      scan_dom(0, document.body, (potentialPrice) => {
        potentialPrice[1].innerHTML =
          potentialPrice[1].innerHTML +
          // '<button type="button" class="leftmenu btn btn-secondary" data-container="body" data-toggle="popover" data-placement="top" data-content="Vivamus sagittis lacus vel augue laoreet rutrum faucibus.">Popover on top</button>';
          '<img src="' +
          exContent.priceIcon +
          '" data-toggle="popover" title="Popover title" data-content="And here\'s some amazing content. It\'s very engaging. Right?"/>';
      });
    }
  }
});
