import onChange from 'on-change';

export default (state, elements, i18next) => {
  const handleForm = () => {
    const { form: { valid, error } } = state;
    const { input, feedback } = elements;

    if (valid) {
      input.classList.remove('is-invalid');
    } else {
      input.classList.add('is-invalid');
      feedback.classList.add('text-danger');
      feedback.textContent = i18next.t(`error.${error}`);
    }
  };
  const watchedState = onChange(state, (path) => {
    switch (path) {
      case ('form'):
        handleForm();
        break;
      default:
        break;
    }
  });
  return watchedState;
};
