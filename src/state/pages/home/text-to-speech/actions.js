import { START_TEXT_TO_SPEECH, END_TEXT_TO_SPEECH } from '../../../../constants/actions';

export const startTextToSpeech = (textToSpeechLang, textToSpeechText) => ((dispatch) => {
  console.log(textToSpeechText);
  console.log('huh');
  window.require('electron').ipcRenderer.invoke('tts-with-google-async', textToSpeechText, textToSpeechLang, 1)
    .then(function (url) {
      console.log(url); // https://translate.google.com/translate_tts?...
    })
    .catch(function (err) {
      console.error(err.stack);
    });

  if (textToSpeechText.length < 1) return;

  dispatch({ type: START_TEXT_TO_SPEECH, textToSpeechLang, textToSpeechText });

  const voices = window.speechSynthesis.getVoices();

  let voice;
  for (let i = 0; i < voices.length; i += 1) {
    // special case for Chinese
    if (textToSpeechLang === 'zh') {
      if (voices[i].lang === 'zh-CN') {
        voice = voices[i];
        break;
      }
    } else if (voices[i].lang.startsWith(textToSpeechLang)) {
      voice = voices[i];
      break;
    }
  }

  const utterThis = new window.SpeechSynthesisUtterance(textToSpeechText);
  utterThis.voice = voice;
  utterThis.onend = () => {
    dispatch({ type: END_TEXT_TO_SPEECH });
  };

  window.speechSynthesis.speak(utterThis);

  dispatch({ type: START_TEXT_TO_SPEECH });
});

export const endTextToSpeech = () => ((dispatch) => {
  window.speechSynthesis.cancel();
  dispatch({ type: END_TEXT_TO_SPEECH });
});
