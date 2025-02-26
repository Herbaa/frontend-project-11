export default {
  string: {
    url: () => ({ key: 'notURL' }),
  },
  mixed: {
    required: () => ({ key: 'notEmpty' }),
    notOneOf: () => ({ key: 'notOneOf' }),
  },
};
