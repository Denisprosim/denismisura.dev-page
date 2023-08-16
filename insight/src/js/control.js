const draggables = document.querySelectorAll(".icon");
const containers = document.querySelectorAll(".place");
const appContainer = document.getElementById("appstore");
const panels = document.querySelectorAll(".panel");
const page = document.querySelectorAll(".page");

const boxes = document.querySelectorAll(".box");
const resizers = document.querySelectorAll(".resizer");

let isResizing = false;

function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

//Drag'n'drop window
for (let panel of panels) {
  panel.addEventListener("mousedown", dragMousedown);
}

function dragMousedown(e) {
  let block = e.target.parentNode;
  window.addEventListener("mousemove", mousemove);
  window.addEventListener("mouseup", mouseup);
  if (!block.classList.contains("dots") && !block.classList.contains("panel")) {
    makeActive(block);
  }
  let prevX = e.clientX;
  let prevY = e.clientY;

  function mousemove(e) {
    e.preventDefault();
    if (
      !isResizing &&
      !block.classList.contains("fullsize") &&
      !block.classList.contains("dots") &&
      !block.classList.contains("panel")
    ) {
      let newX = prevX - e.clientX;
      let newY = prevY - e.clientY;

      const rect = block.getBoundingClientRect();
      block.style.left = rect.left - newX + "px";
      if (e.clientY < 0) {
        block.style.top = 0;
      } else {
        block.style.top = rect.top - newY + "px";
      }
      prevX = e.clientX;
      prevY = e.clientY;
    }
  }

  function mouseup() {
    window.removeEventListener("mousemove", mousemove);
    window.removeEventListener("mouseup", mouseup);
  }
}

//Resizing window
for (let resizer of resizers) {
  resizer.addEventListener("mousedown", resizeMousedown);
}

function resizeMousedown(e) {
  currentResizer = e.target;
  let block = e.target.parentNode;
  isResizing = true;
  makeActive(block);
  let prevX = e.clientX;
  let prevY = e.clientY;

  window.addEventListener("mousemove", mousemove);
  window.addEventListener("mouseup", mouseup);

  function mousemove(e) {
    e.preventDefault();
    const rect = block.getBoundingClientRect();

    if (currentResizer.classList.contains("se")) {
      block.style.width = e.clientX - block.offsetLeft + "px";
      block.style.height = e.clientY - block.offsetTop + "px";
    }
    if (currentResizer.classList.contains("e")) {
      block.style.width = e.clientX - block.offsetLeft + "px";
    }
    if (currentResizer.classList.contains("s")) {
      block.style.height = e.clientY - block.offsetTop + "px";
    }

    prevX = e.clientX;
    prevY = e.clientY;
  }

  function mouseup() {
    window.removeEventListener("mousedown", resizeMousedown);
    window.removeEventListener("mousemove", mousemove);
    isResizing = false;
  }
}

//Drag'n'drop icon
draggables.forEach((draggable) => {
  draggable.addEventListener("dragstart", () => {
    draggable.classList.add("dragging");
  });

  draggable.addEventListener("dragend", () => {
    draggable.classList.remove("dragging");
  });
});

containers.forEach((container) => {
  container.addEventListener("dragover", (e) => {
    e.preventDefault();

    const draggable = document.querySelector(".dragging");
    container.appendChild(draggable);
  });
});

function showApp(elementId) {
  var app = document.getElementById(elementId);
  if (app.classList.contains("hidden")) {
    app.classList.remove("hidden");
    app.classList.add("grow-animation");
    makeActive(app);
    setTimeout(function () {
      app.classList.remove("grow-animation");
    }, 200);
  } else if (!app.classList.contains("x-active")) {
    makeActive(app);
  } else {
    shrink(app);
  }
}

function makeActive(element) {
  var activeElement = document.querySelector(".x-active");
  if (activeElement !== null) {
    activeElement.classList.remove("x-active");
    element.classList.add("x-active");
  } else {
    element.classList.add("x-active");
  }
}

function showPage(elementId) {
  var ppLink = document.getElementById("projectpagelink");
  var hpLink = document.getElementById("homepagelink");
  var ppContent = document.getElementById("projectpage");
  var hpContent = document.getElementById("homepage");

  if (elementId == "projectpage") {
    if (ppContent.classList.contains("hidden")) {
      hpContent.classList.add("hidden");
      hpLink.classList.remove("page-selected");
      ppContent.classList.remove("hidden");
      ppLink.classList.add("page-selected");
    }
  } else {
    ppContent.classList.add("hidden");
    ppLink.classList.remove("page-selected");
    hpContent.classList.remove("hidden");
    hpLink.classList.add("page-selected");
  }
}

function shrink(element) {
  element.classList.add("shrink-animation");
  setTimeout(function () {
    element.classList.remove("shrink-animation");
    element.classList.add("hidden");
    element.classList.remove("x-active");
  }, 200);
}

function maximalize(elementId) {
  var app = document.getElementById(elementId);
  if (app.classList.contains("fullsize")) {
    makeActive(app);
    app.classList.remove("fullsize");
    app.classList.add("windowed");
  } else {
    app.style.left = null;
    app.style.top = null;
    app.style.width = null;
    app.style.height = null;
    makeActive(app);
    app.classList.add("fullsize");
    app.classList.remove("windowed");
  }
}

var modal = document.getElementById("detailmodal");

function showImg(imgId) {
  var img = document.getElementById(imgId);
  var captionText = document.getElementById("caption");
  var modalImg = document.getElementById("pp-image");
  modal.style.display = "block";
  modalImg.src = img.src;
  captionText.innerHTML = img.alt;
}

var span = document.getElementsByClassName("pp-close")[0];

span.onclick = function () {
  modal.style.display = "none";
};

var mail = document.getElementById("mail");

if (window.matchMedia("(max-width: 900px)").matches) {
  mail.classList.remove("windowed");
  mail.classList.add("fullsize");
}
