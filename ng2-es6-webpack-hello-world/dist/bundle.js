/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _componentsHelloHelloJs = __webpack_require__(1);

	// import {HelloTemplateComponent} from "./components/helloTemplate/helloTemplate.js";

	var _nmAngular2Es6DevCoreJs = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"nm/angular2/es6/dev/core.js\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	(0, _nmAngular2Es6DevCoreJs.bootstrap)(_componentsHelloHelloJs.MyAppComponent);

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	// import 'nm/reflect-metadata/Reflect.js';
	// import 'nm/zone.js/lib/zone.js';
	// import 'nm/es6-shim/es6-shim.js';
	'use strict';

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var _nmAngular2Es6DevCoreJs = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"nm/angular2/es6/dev/core.js\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

	var MyAppComponent = (function () {
		function MyAppComponent() {
			_classCallCheck(this, _MyAppComponent);

			this.name = 'World';
		}

		var _MyAppComponent = MyAppComponent;
		MyAppComponent = (0, _nmAngular2Es6DevCoreJs.View)({
			template: '<h1>Hello {{ name }}</h1>'
		})(MyAppComponent) || MyAppComponent;
		MyAppComponent = (0, _nmAngular2Es6DevCoreJs.Component)({
			selector: 'my-app'
		})(MyAppComponent) || MyAppComponent;
		return MyAppComponent;
	})();

	(0, _nmAngular2Es6DevCoreJs.bootstrap)(MyAppComponent);

/***/ }
/******/ ]);