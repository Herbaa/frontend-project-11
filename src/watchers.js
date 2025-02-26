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
      feedback.textContent = i18next.t(`errors.${error}`);
    }
  };
  const handleLoading = (state) => {
    const { loadingProcess } = state;
    const { submitButton, feedback } = elements;
    switch (loadingProcess.status) {
      case ('success'):
        submitButton.disabled = false;
        feedback.textContent = i18next.t('trans.success');
        break;
      case ('failed'):
        submitButton.disabled = false;
        break;
      case ('loading'):
        submitButton.disabled = true;
        break;
      default:
        break;
    }
  };
  const handlePosts = () => {

  };
  const handleFeeds = () => {

  };
  const watchedState = onChange(initialState, (path) => {
    switch (path) {
      case ('form'):
        handleForm(initialState);
        break;
      case ('loadingProcess.status'):
        handleLoading(initialState);
        break;
      case ('feeds'):
        handleFeeds();
        break;
      case ('posts'):
        handlePosts();
        break;
      default:
        break;
    }
    console.log('путь - ', path);
  });
  return watchedState;
};
