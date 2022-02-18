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

scan_dom(0, document.body, (potentialPrice) => {
  potentialPrice[1].innerHTML =
    potentialPrice[1].innerHTML +
    '<img src="bootstrap-5.1.3-dist/icons-main/icons/activity.svg"/>';
});
