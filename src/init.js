import i18next from 'i18next';
import * as yup from 'yup';
import axios from 'axios';
import resources from './locales/index.js';
import locale from './locale.js';
import render from './watchers.js';

const newProxy = (url) => {
  const newUrl = new URL('https://allorigins.hexlet.app/get');
  newUrl.searchParams.set('url', url);
  return newUrl;
};
const validateUrl = (url, feeds) => {
  const feedsUrl = feeds.map((feed) => feed.url);
  const schema = yup.string().required().url().notOneOf(feedsUrl);

  return schema.validate(url).then(() => null).catch((error) => error.message);
};
const loadRss = (watchedState, url) => {
  watchedState.loadingProcess.status = 'loading';
  const urlProxy = newProxy(url);
  return axios.get(urlProxy).then(() => {});
};

export default () => {
  const elements = {
    form: document.querySelector('.rss-form'),
    submitButton: document.querySelector('[type="submit"]'),
    formInput: document.querySelector('.form-control'),
    feedback: document.querySelector('.feedback'),
  };

  const initialState = {
    form: {
      valid: false,
      error: null,
      status: 'filling',
    },
    loadingProcess: {
      status: 'success',
      error: null,
    },
    feeds: [],
    posts: [],
  };

  const i18nextInstance = i18next.createInstance();

  const promise = i18nextInstance.init({
    lng: 'ru',
    resources,
  })
    .then(() => {
      yup.setLocale(locale);
      const watchedState = render(initialState, elements, i18nextInstance);

      elements.form.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const url = formData.get('url');
        validateUrl(url, watchedState.feeds).then((error) => {
          if (!error) {
            loadRss(watchedState, url);
            watchedState.form = {
              ...watchedState.form,
              valid: true,
              error: null,
            };
            // console.log(watchedState.form);
            // console.log(error);
          } else {
            watchedState.form = {
              ...watchedState.form,
              valid: false,
              error: error.key,
            };
            // console.log(watchedState.form);
            // console.log(error);
          }
        });
      });
    });
  return promise;
};
