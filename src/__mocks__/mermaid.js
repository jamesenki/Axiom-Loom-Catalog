const mermaid = {
  initialize: jest.fn(),
  render: jest.fn((id, content) => {
    return Promise.resolve({
      svg: `<svg>${content}</svg>`,
      bindFunctions: jest.fn()
    });
  }),
  parse: jest.fn(() => true),
  parseError: null
};

module.exports = mermaid;