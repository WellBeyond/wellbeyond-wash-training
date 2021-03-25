import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
// import i18n (needs to be bundled ;))
import './i18n';
import * as serviceWorker from './serviceWorker';
import {defineCustomElements} from '@ionic/pwa-elements/loader';

ReactDOM.render(<App />, document.getElementById('root'));
serviceWorker.register();
// Call the element loader after the app has been rendered the first time
defineCustomElements(window);

