export default {

  control: {
    backgroundColor: '#fff',
    fontSize: 16,
    outline: 'none',
  },

  '&multiLine': {
    control: {
      minHeight: 60,
    },
    highlighter: {
      padding: 9,
      border: '1px solid transparent',
      borderRadius: '0.4rem',
    },
    input: {
      padding: 9,
      outline: 'none',
      borderRadius: '0.4rem',
    },
  },

  '&singleLine': {
    display: 'inline-block',
    width: 180,

    highlighter: {
      padding: 1,
      border: '2px inset transparent',
    },
    input: {
      padding: 1,
      border: '2px inset',
      outline: 'none',
    },
  },

  suggestions: {
    list: {
      backgroundColor: 'white',
      border: '1px solid rgb(239 246 255)',
      // fontSize: 16,
    },
    item: {
      cursor: 'pointer',
      padding: '0.2rem 1rem',
      borderBottom: '1px solid rgb(239 246 255)',
      '&focused': {
        backgroundColor: 'rgb(239 246 255)',
      },
    },
  },
}