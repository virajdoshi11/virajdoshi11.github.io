//do this with nodemailer afterwards
// var send = document.getElementById("btncontact");
// var ctcForm = document.getElementById("ctcForm");
// ctcForm.addEventListener("submit", (e) => {
//   e.preventDefault();
//   var email = document.getElementById("email").value;
//   var msg = "From: " + email + "\n" + document.getElementById("message").value;
//   var url = "mailto:virajdoshi11@gmail.com?body=" + encodeURIComponent(msg);
//   window.location.href = url;
// })
// send.addEventListener("click", (e) => {
//   // e.preventDefault();
//   var email = document.getElementById("email").value;
//   var msg = "From: " + email + "\n" + document.getElementById("message").value;
//   var url = "mailto:virajdoshi11@gmail.com?body=" + encodeURIComponent(msg);
//   window.location.href = url;
// })

function setCookie(name, value, daysToLive = undefined) {
  // Encode value in order to escape semicolons, commas, and whitespace
  var cookie = name + "=" + encodeURIComponent(value);

  if (typeof daysToLive === "number") {
    /* Sets the max-age attribute so that the cookie expires
    after the specified number of days */
    cookie += "; max-age=" + (daysToLive * 24 * 60 * 60);
  }

  document.cookie = cookie;
}
function getCookie(name) {
  // Split cookie string and get all individual name=value pairs in an array
  var cookieArr = document.cookie.split(";");

  // Loop through the array elements
  for (var i = 0; i < cookieArr.length; i++) {
    var cookiePair = cookieArr[i].split("=");

    /* Removing whitespace at the beginning of the cookie name
    and compare it with the given string */
    if (name == cookiePair[0].trim()) {
      // Decode the cookie value and return
      return decodeURIComponent(cookiePair[1]);
    }
  }

  // Return null if not found
  return null;
}

var mode = document.getElementById("flexSwitchCheckDefault");
let projDesR = document.getElementsByClassName("proj-des-right");
let projDesL = document.getElementsByClassName("proj-des-left");
let hamburger = document.getElementById("ham");
let showInstall = document.getElementById("showInstall");

function blackout() {
  document.documentElement.style.setProperty("--secondary", "#000000");
  document.getElementsByTagName("body")[0].setAttribute('data-bs-theme', 'black');
  hamburger.style.color = "white";
  for (let i = 0; i < projDesR.length; i++) {
    projDesR[i].style.backgroundColor = "#232323"
  }
  for (let i = 0; i < projDesL.length; i++) {
    projDesL[i].style.backgroundColor = "#232323"
  }
  setCookie("mode", 0)
}

function whiteout() {
  document.documentElement.style.setProperty("--secondary", "#ffffff");
  // document.getElementsByClassName("body")[0]
  document.getElementsByTagName("body")[0].setAttribute('data-bs-theme', 'white');
  hamburger.style.color = "black";
  for (let i = 0; i < projDesR.length; i++) {
    projDesR[i].style.backgroundColor = "#dcdcdc"
  }
  for (let i = 0; i < projDesL.length; i++) {
    projDesL[i].style.backgroundColor = "#dcdcdc"
  }
  setCookie("mode", 1);
}

showInstall.addEventListener("click", () => {
  if(showInstall.checked) {  //dont show the install app toast
    setCookie("showInstallToast", 0);
  } else {
    setCookie("showInstallToast", 1);
  }
})

mode.addEventListener("click", () => {
  if (mode.checked) {    //do black
    blackout()
  } else {
    whiteout()
  }
});

const wiggletime = 100;

function shakeElement(el) {
  el.classList.add('rotateable');
  el.style.marginLeft = '20px';

  setTimeout(function () {
    el.style.marginLeft = '-20px';
    setTimeout(function () {
      el.style.marginLeft = '0px';
    }, wiggletime);
  }, wiggletime);

  return true;
}

function showConfirmation(status) {
  // Get the snackbar DIV
  var x = document.getElementById("snackbar");
  var timeout = 3000;
  // Add the "show" class to DIV
  let addClasses = [ 'show' ];
  x.innerText = "Message Sent!";
  
  if(status == "emailError") {
    addClasses.push("emailError");
    x.innerText = "Please enter a valid Email";
  } else if(status == "undefined") {
    addClasses.push("emailError");
    x.innerText = "Who are you? Give your actual email ID";
    timeout = 30000;
  }
  // x.className = "show";
  x.classList.add(...addClasses);
  // After 3 seconds, remove the show class from DIV
  setTimeout(function () {
    // x.className = x.className.replace("show", "");
    x.className = "";
  }, timeout);
}

var toastMsg = document.getElementsByClassName("toast-body")[0];
var myToastEl = document.getElementById('liveToast');

/**
 * @param {string} prevColor
 * @param {string} nextColor
 * @param {string} msg
 */
function toastSetting(prevColor, nextColor, msg) {
  myToastEl.className = myToastEl.className.replace(prevColor, nextColor);
  toastMsg.textContent = msg
}

function handleConnectionStatus() {
  window.addEventListener('online', () => {
    toastSetting("bg-danger", "bg-success", "You are back!!");
    setTimeout(function () { myToastEl.className = myToastEl.className.replace("show", "hide") }, 3000);
  });
  window.addEventListener('offline', () => {
    toastSetting("bg-success", "bg-danger", "You are offline :(");
    myToastEl.className = myToastEl.className.replace("hide", "show");
  });
}

// This method will only run once during initial page load
function checkConnection() {
  if(!window.navigator.onLine) {
    myToastEl.className = myToastEl.className.replace("hide", "show");
    toastSetting("bg-success", "bg-danger", "You are viewing this from cache, please go online to see lastest changes")
  }
}

// colorPicker.addEventListener("input", () => {
//       var hsl = HexToHSL(colorPicker.value);
//       if(hsl.l < 10) {
//         document.documentElement.style.setProperty("--primary", sphere.style.color);
//         //here the sphere value is used as a previous value so that id the lightness 
//         //id less than 10% then the previous value of the inout will be chosen
//       } else {
//         document.documentElement.style.setProperty("--primary", colorPicker.value);
//         sphere.style.color = colorPicker.value;
//       }
//     })