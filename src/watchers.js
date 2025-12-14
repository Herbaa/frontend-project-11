import onChange from 'on-change';

export default (initialState, elements, i18next) => {
  const handleForm = (state) => {
    const { form: { valid, error } } = state;
    const { formInput, feedback } = elements;

    if (valid) {
      formInput.classList.remove('is-invalid');
    } else {
      formInput.classList.add('is-invalid');
      feedback.classList.add('text-danger');
      feedback.textContent = i18next.t([`errors.${error}`, 'errors.unknown']);
    }
  };
  const handleLoading = (state) => {
    const { loadingProcess } = state;
    const { formInput, submitButton, feedback } = elements;
    switch (loadingProcess.status) {
      case ('success'):
        formInput.value = '';
        submitButton.disabled = false;
        formInput.removeAttribute('readonly');
        feedback.classList.add('text-success');
        feedback.textContent = i18next.t('load.success');
        break;
      case ('failed'):
        submitButton.disabled = false;
        formInput.removeAttribute('readonly');
        feedback.classList.add('text-danger');
        feedback.textContent = i18next.t([`errors.${loadingProcess.error}`, 'errors.unknown']);
        break;
      case ('loading'):
        submitButton.disabled = true;
        formInput.setAttribute('readonly', true);
        feedback.classList.remove('text-success');
        feedback.classList.remove('text-danger');
        feedback.textContent = '';
        break;
      default:
        break;
    }
  };
  const handlePosts = (state) => {
    const { posts, ui } = state;
    const { postDiv } = elements;

    const fragmentStructure = document.createElement('div');
    fragmentStructure.classList.add('card', 'border-0');
    fragmentStructure.innerHTML = `
      <div class='card-body'></div>
    `;

    const postsTitle = document.createElement('h2')
    postsTitle.classList.add('card-title', 'h4')
    postsTitle.textContent = i18next.t('posts')
    fragmentStructure.querySelector('.card-body').appendChild(postsTitle)

    const postsList = document.createElement('ul');
    postsList.classList.add('list-group', 'border-0', 'rounded-0');

    const postsListItems = posts.map((post) => {
      const element = document.createElement('li');
      element.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
      const link = document.createElement('a')
      link.setAttribute('href', post.link)
      const className = ui.viewPosts.has(post.id) ? ['fw-normal', 'link-secondary'] : ['fw-bold']
      link.classList.add(...className)
      link.dataset.id = post.id
      link.textContent = post.title
      link.setAttribute('target', '_blank')
      link.setAttribute('rel', 'noopener noreferrer')
      element.appendChild(link)
      const button = document.createElement('button')
      button.setAttribute('type', 'button');
      button.classList.add('btn', 'btn-outline-primary', 'btn-sm')
      button.dataset.id = post.id
      button.dataset.bsToggle = 'modal'
      button.dataset.bsTarget = '#modal'
      button.textContent = i18next.t('view')
      element.appendChild(button)
      return element;
    })

    postsList.append(...postsListItems)
    fragmentStructure.appendChild(postsList)
    postDiv.innerHTML = ''
    postDiv.appendChild(fragmentStructure)
  }


  const handleFeeds = (state) => {
    const { feeds } = state;
    const {feedDiv} = elements;

    const newFeedDiv = document.createElement('div')
    newFeedDiv.classList.add('card', 'border-0');

    const titleDiv = document.createElement('div')
    titleDiv.classList.add('card-body');

    const h2Element = document.createElement('h2')
    h2Element.classList.add('card-title', 'h4');
    h2Element.textContent = 'Фиды'
    titleDiv.append(h2Element)
    newFeedDiv.append(titleDiv)

    const feedsList = document.createElement('ul')
    feedsList.classList.add('list-group', 'border-0', 'rounded-0')

    feeds.forEach((item) => {
      const feed = document.createElement('li')
      feed.classList.add('list-group-item', 'border-0', 'border-end-0')

      const itemTitle = document.createElement('h3')
      itemTitle.classList.add('h6', 'm-0')
      itemTitle.textContent = item.title

      const itemDesription = document.createElement('p')
      itemDesription.classList.add('m-0', 'small', 'text-black-50')
      itemDesription.textContent = item.description
      feed.append(itemTitle, itemDesription)
      feedsList.prepend(feed)
    });
    newFeedDiv.append(feedsList);
    feedDiv.replaceChildren(newFeedDiv)

  };

  const handleModal = (state) => {
    const post = state.posts.find(({id}) => id === state.modal.postId)
    const title = elements.modal.querySelector('.modal-title')
    const body = elements.modal.querySelector('.modal-body')
    const arcticle = elements.modal.querySelector('.full-article')

    title.textContent = post.title
    body.textContent = post.description
    arcticle.href = post.link
  }

  const watchedState = onChange(initialState, (path) => {
    switch (path) {
      case ('form'):
        handleForm(initialState);
        break;
      case ('loadingProcess.status'):
        handleLoading(initialState);
        break;
      case ('feeds'):
        handleFeeds(initialState);
        break;
      case ('posts'):
        handlePosts(initialState);
        break;
      case ('modal.postId'):
        handleModal(initialState)
        break
      case ('ui.viewPosts'):
        handlePosts(initialState)
        break
      default:
        break;
    }
    // console.log('путь - ', path);
  });
  return watchedState;
};
