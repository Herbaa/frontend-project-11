export default {
  string: {
    url: () => ({ key: 'notURL' }),
  },
  mixed: {
    required: () => ({ key: 'empty' }),
    notOneOf: () => ({ key: 'exists' }),
  },
};
