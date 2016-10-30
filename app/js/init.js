window.nodeRequire = window.require;
window.nodeExports = window.exports;
window.nodeModule = window.module;
delete window.require;
delete window.exports;
delete window.module;

// Load ipcRenderer and store it on the global window variable to make it easy to use
window.nodeIpc = nodeRequire('electron').ipcRenderer;
window.nodeRemote = nodeRequire('electron').remote;
window.nodeShell = nodeRequire('electron').shell;

window.pageStack = [];
let currentSection = null;
