const {
  BrowserWindow,
  app,
  dialog,
  ipcMain,
  shell,
} = require('electron');

const translateWithGoogle = require('@vitalets/google-translate-api');
const googleTTS = require('google-tts-api');

const {
  getPreference,
  getPreferences,
  resetPreferences,
  setPreference,
} = require('../libs/preferences');

const {
  getLocale,
  getLocales,
} = require('../libs/locales');

const loadListeners = () => {
  // Locale
  ipcMain.on('get-locale', (e, id) => {
    e.returnValue = getLocale(id);
  });

  ipcMain.on('get-locales', (e) => {
    e.returnValue = getLocales();
  });

  // Preferences
  ipcMain.on('get-preference', (e, name) => {
    e.returnValue = getPreference(name);
  });

  ipcMain.on('get-preferences', (e) => {
    e.returnValue = getPreferences();
  });

  ipcMain.on('request-set-preference', (e, name, value) => {
    setPreference(name, value);
  });

  ipcMain.on('request-reset-preferences', () => {
    dialog.showMessageBox(BrowserWindow.getAllWindows()[0], {
      type: 'question',
      buttons: [getLocale('resetNow'), getLocale('cancel')],
      message: getLocale('resetDesc'),
      cancelId: 1,
    })
      .then((response) => {
        if (response === 0) {
          resetPreferences();

          ipcMain.emit('request-show-require-restart-dialog');
        }
      });
  });

  ipcMain.on('request-show-require-restart-dialog', () => {
    dialog.showMessageBox({
      type: 'question',
      buttons: [getLocale('quitNow'), getLocale('later')],
      message: getLocale('requireRestartDesc'),
      cancelId: 1,
    })
      .then((response) => {
        if (response === 0) {
          app.quit();
        }
      });
  });

  ipcMain.on('request-open-in-browser', (e, browserUrl) => {
    shell.openExternal(browserUrl);
  });

  ipcMain.on('request-show-message-box', (e, message, type) => {
    dialog.showMessageBox(BrowserWindow.getAllWindows()[0], {
      type: type || 'error',
      message,
      buttons: [getLocale('ok')],
      cancelId: 0,
      defaultId: 0,
    });
  });

  // make sure there's a delay between requests
  // https://github.com/vitalets/google-translate-api/issues/9
  let p = Promise.resolve();
  ipcMain.handle('translate-with-google-async', (e, ...args) => {
    const p1 = p.then(() => translateWithGoogle(...args));
    p = p1.then(() => new Promise((resolve, reject) => {
      try {
        setTimeout(() => { resolve(); }, 500);
      } catch (err) {
        reject(err);
      }
    }));
    return p1;
  });

  ipcMain.handle('tts-with-google-async', (e, ...args) => googleTTS('hello', 'en', 1));
};

module.exports = loadListeners;
