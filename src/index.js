/* global document */
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import 'typeface-roboto/index.css';

import './main.css';

import store from './state/reducers';

import AppWrapper from './components/app-wrapper';

// have to make this global for the languages plugin, sadly
global.lunr = require('lunr');
require('lunr-languages/lunr.stemmer.support')(global.lunr);
require('lunr-languages/lunr.multi')(global.lunr);
require('lunr-languages/lunr.da')(global.lunr);
require('lunr-languages/lunr.de')(global.lunr);
require('lunr-languages/lunr.du')(global.lunr);
require('lunr-languages/lunr.es')(global.lunr);
require('lunr-languages/lunr.fi')(global.lunr);
require('lunr-languages/lunr.fr')(global.lunr);
require('lunr-languages/lunr.hu')(global.lunr);
require('lunr-languages/lunr.it')(global.lunr);
require('lunr-languages/lunr.ja')(global.lunr);
require('lunr-languages/lunr.jp')(global.lunr);
require('lunr-languages/lunr.nl')(global.lunr);
require('lunr-languages/lunr.no')(global.lunr);
require('lunr-languages/lunr.pt')(global.lunr);
require('lunr-languages/lunr.ro')(global.lunr);
require('lunr-languages/lunr.ru')(global.lunr);
require('lunr-languages/lunr.sv')(global.lunr);
require('lunr-languages/lunr.th')(global.lunr);
require('lunr-languages/lunr.tr')(global.lunr);
require('lunr-languages/lunr.vi')(global.lunr);

const { webFrame } = window.require('electron');

webFrame.setVisualZoomLevelLimits(1, 1);

// https://github.com/quanglam2807/translatium/issues/28
// remove text formatting when copying
document.addEventListener('copy', (e) => {
  const textOnly = document.getSelection().toString();
  const clipdata = e.clipboardData || window.clipboardData;
  clipdata.setData('text/plain', textOnly);
  clipdata.setData('text/html', textOnly);
  e.preventDefault();
});

render(
  <Provider store={store}>
    <AppWrapper />
  </Provider>,
  document.getElementById('app'),
);

window.speechSynthesis.onvoiceschanged = () => {
  render(
    <Provider store={store}>
      <AppWrapper />
    </Provider>,
    document.getElementById('app'),
  );
};
