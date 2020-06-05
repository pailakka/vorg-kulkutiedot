import 'es6-shim';
import 'unfetch/polyfill/index.js'

import App from './App.svelte';

const app = new App({
	target: document.getElementById("app"),
});

export default app;