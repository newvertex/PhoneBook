// Prevent load content from outside of app by drag&drop
document.addEventListener('dragover', (event) => event.preventDefault());
document.addEventListener('drop', (event) => event.preventDefault());

// Import all templates file
let imports = document.querySelectorAll('link[rel=import]');
for (let link of imports) {
  let template = link.import.querySelector('template');
  let clone = document.importNode(template.content, true);
  document.querySelector('.content').appendChild(clone);
}

// Check the url for action like close, minimize, back or change the page section and Etc.
window.addEventListener('hashchange', (event) => {
  let target = window.location.hash.substring(1, window.location.hash.length);

  switch (target) {
    case 'back':
      goBack();
      break;
    case 'quit':
      nodeIpc.send('app', 'quit');
      break;
    case 'minimize':
      nodeIpc.send('app', 'minimize');
      break;
    case 'add-person':
      addPerson();
      break;
    default:
      goTo(target);
  }

});

// Set all anchor tag to add the page to page stack for navigation use
let anchors = document.querySelectorAll('a[href]');
for (let a of anchors) {
  const url = a.getAttribute('href');
  if (url.indexOf('http') === 0) {
    a.addEventListener('click', (event) => {
      event.preventDefault();
      nodeShell.openExternal(url);
    });
  }
}

let navMenuButton = document.querySelector('#nav-btn-menu');
let navBackButton = document.querySelector('#nav-btn-back');
let navTitle = document.querySelector('#nav-title');

// Switch the nav-menu button with nav-back button
function checkPageNav() {
  if (pageStack.length > 1) {
    navMenuButton.classList.add('hide');
    navBackButton.classList.remove('hide');
  } else {
    navMenuButton.classList.remove('hide');
    navBackButton.classList.add('hide');
  }
}

function setTitle(title) {
  navTitle.innerText = title;
}

// Show the page that user want
function goTo(page) {
  pageStack.push(page);
  checkPageNav();

  // Switch the section visibility and show any effect we want
  let newSection = document.querySelector('#section-' + page);

  if (currentSection) {
    currentSection.classList.add('hide');
  }

  if (newSection && newSection.classList.contains('hide')) {
    newSection.classList.remove('hide');
    currentSection = newSection;
  }

  setTitle(newSection.dataset.title);

}

// Go one level back in page stack
function goBack() {
  window.location.hash = pageStack.slice(-2)[0];
  pageStack = pageStack.slice(0, pageStack.length - 2);
  checkPageNav();
}

goTo('index');  // Load the index main content from the template

let nameField = document.querySelector('#name');
let emailField = document.querySelector('#email');
let telField = document.querySelector('#tel');

function addPerson() {
  console.log('itemAdded', nameField.value);
  goBack();
}
