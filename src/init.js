import i18next from 'i18next';
import 'bootstrap';
import * as yup from 'yup';
import axios from 'axios';
import _ from 'lodash';
import resources from './locales/index.js';
import locale from './locale.js';
import render from './watchers.js';
import parse from './parse.js';

const newProxy = (url) => {
  const urlWithProxy = new URL('/get', 'https://allorigins.hexlet.app');
  urlWithProxy.searchParams.set('url', url);
  urlWithProxy.searchParams.set('disableCache', 'true');
  return urlWithProxy.toString();
};

const validateUrl = (url, feeds) => {
  const feedsUrl = feeds.map((feed) => feed.url);
  const schema = yup.string().required().url().notOneOf(feedsUrl);
  return schema.validate(url).then(() => null).catch((error) => error.message);
};

const handleLoadingProcessError = (e) => {
  if (e.isParsingError) {
    return 'noRSS';
  }
  if (e.isAxiosError) {
    return 'network';
  }
  return 'unknown';
};

const procRss = (watchedState, url) => {
  watchedState.loadingProcess.status = 'loading';
  const urlWithProxy = newProxy(url);
  return axios.get(urlWithProxy)
    .then((response) => {
      const data = parse(response.data.contents);
      const feed = {
        url, id: _.uniqueId(), title: data.title, description: data.descrpition,
      };
      const posts = data.items.map((item) => ({ ...item, channelId: feed.id, id: _.uniqueId() }));
      watchedState.posts.unshift(...posts);
      watchedState.feeds.unshift(feed);

      watchedState.loadingProcess.error = null;
      watchedState.loadingProcess.status = 'success';
      watchedState.form = {
        ...watchedState.form,
        status: 'filling',
        error: null,
      };
    })
    .catch((e) => {
      console.log(e);
      watchedState.loadingProcess.error = handleLoadingProcessError(e);
      watchedState.loadingProcess.status = 'failed';
    });
};

const time = 5000;

const loadNewPosts = (watchedState) => {
  const promise = watchedState.feeds.map((feed) => {
    const urlInProxy = newProxy(feed.url);
    return axios.get(urlInProxy).then((res) => {
      const feedData = parse(res.data.contents);
      const newPosts = feedData.items.map((item) => ({ ...item, channelId: feed.id }));
      const oldPosts = watchedState.posts.filter((post) => post.channelId === feed.id);

      const posts = _.differenceWith(newPosts, oldPosts, (p1, p2) => p1.title === p2.title)
        .map((post) => ({ ...post, id: _.uniqueId() }));
      // console.log(posts)
      if (posts.length > 0) {
        watchedState.posts.unshift(...posts);
      }
    })
      .catch((e) => { console.error(e); });
  });

  Promise.all(promise).finally(() => {
    setTimeout(() => loadNewPosts(watchedState), time);
  });
};

export default () => {
  const elements = {
    form: document.querySelector('.rss-form'),
    submitButton: document.querySelector('[type="submit"]'),
    formInput: document.querySelector('.form-control'),
    feedback: document.querySelector('.feedback'),
    postDiv: document.querySelector('.posts'),
    feedDiv: document.querySelector('.feeds'),
    modal: document.querySelector('#modal'),
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
    modal: {
      postId: null,
    },
    ui: {
      viewPosts: new Set(),
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
            watchedState.form = {
              ...watchedState.form,
              valid: true,
              error: null,
            };
            procRss(watchedState, url);
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

      elements.postDiv.addEventListener('click', (e) => {
        if (!('id' in e.target.dataset)) {
          return;
        }

        const { id } = e.target.dataset;
        watchedState.modal.postId = String(id);
        watchedState.ui.viewPosts.add(id);
      });

      setTimeout(() => loadNewPosts(watchedState), time);
    });

  return promise;
};
