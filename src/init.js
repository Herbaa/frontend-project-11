import i18next from 'i18next';
import * as yup from 'yup';
import resources from './locales/index.js';
import locale from './locale.js';
import watcher from './watchers.js';

export default () => {
  const elements = {
    form: document.querySelector('.rss-form'),
    button: document.querySelector('[type="submit"]'),
    input: document.querySelector('.form-control'),
    feedback: document.querySelector('.feedback'),
  };

  const state = {
    form: {
      valid: false,
      error: null,
      status: 'filling',
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
      const validateUrl = (url, feeds) => {
        const feedsUrl = feeds.map((feed) => feed.url);
        const schema = yup.string().required().url().notOneOf(feedsUrl);

        return schema.validate(url).then(() => null).catch((error) => error.message);
      };
      const watchedState = watcher(state, elements, i18nextInstance);

      elements.form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const url = formData.get('url');
        validateUrl(url, watchedState.feeds).then((error) => {
          if (!error) {
            watchedState.form = {
              ...watchedState.form,
              valid: true,
              error: null,
            };
          } else {
            watchedState.form = {
              ...watchedState.form,
              valid: false,
              error: error.key,
            };
          }
        });
      });
    });
  return promise;
};
