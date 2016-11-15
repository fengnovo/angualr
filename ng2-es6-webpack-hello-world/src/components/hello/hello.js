// import 'nm/reflect-metadata/Reflect.js';
// import 'nm/zone.js/lib/zone.js';
// import 'nm/es6-shim/es6-shim.js';
import { Component, View, bootstrap } from 'nm/angular2/es6/dev/core.js';
@Component({
	selector: 'my-app'
})
@View({
	template: '<h1>Hello {{ name }}</h1>'
})
class MyAppComponent {
	constructor() {
		this.name = 'World';
	}
}
bootstrap(MyAppComponent);