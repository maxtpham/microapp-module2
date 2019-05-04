import * as base from '../base/scripts';
import App from './app';

base.startup('module2', App)
    .then(() => console.log('Module loaded!'))
    .catch(e => console.error('Module load failed', e));