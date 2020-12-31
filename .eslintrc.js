const path = require('path')

module.exports = {
  root: true,

  parserOptions: {
    parser: 'babel-eslint',
    ecmaVersion: 6,
    sourceType: 'module',
  },

  env: {
    jquery: true,
    browser: true,
    node: true,
  },

  globals: {
    '_': true,
    'burl': true,
    'furl': true,
    'grecaptcha': true,
  },

  extends: [
    'plugin:vue/essential',
    'airbnb-base',
  ],

  settings: {
    'import/resolver': {
      webpack: {
        config: {
          resolve: {
            alias: {
              '@': path.resolve('./src'),
              '@img': path.resolve('./src/assets'),
              '@as': path.resolve('./src/assets'),
              '@c': path.resolve('./src/components'),
              '@v': path.resolve('./src/views'),
              '@css': path.resolve('./src/assets/css'),
              '@mix': path.resolve('./src/assets/mixins'),
              '@js': path.resolve('./src/assets/js'),
              '@api': path.resolve('./src/api'),
            },
            extensions: ['.js', '.vue'],
          },
        },
      },
    },
    'import/extensions': ['.js', '.vue'],
  },

  plugins: [
    'vue',
  ],

  rules: {
    indent: 'error',
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    semi: [
      'error',
      'never',
    ],
    'comma-dangle': ['error', {
      'arrays': 'always-multiline',
      'objects': 'always-multiline',
      'imports': 'never',
      'exports': 'never',
      'functions': 'ignore',
    }],
    'arrow-parens': [
      'error',
      'as-needed',
    ],
    'prefer-template': 'off',
    'prefer-destructuring': 'off',
    'import/first': 'off',
    'linebreak-style': 'off',
    'import/no-extraneous-dependencies': 'off',
    'no-multi-spaces': 'off',
    'no-useless-escape': 'off',
    'quote-props': 'off',
    'max-len': 'warn',
    'class-methods-use-this': 'off',
    'no-underscore-dangle': [
      'error',
      {
        allowAfterThis: true,
      },
    ],
    'no-plusplus': 'off',
    'no-shadow': [
      'error',
      {
        allow: [
          'state',
        ],
      },
    ],
    'no-prototype-builtins': 'off',
    'arrow-body-style': 'off',
    'no-restricted-syntax': 'off',
    'guard-for-in': 'off',
    'no-case-declarations': 'off',
    'import/extensions': [
      2,
      'never',
      {
        vue: 'never',
      },
    ],
    'no-param-reassign': [
      'error',
      {
        props: true,
        ignorePropertyModificationsFor: [
          'state',
          'e',
          'request',
          'config',
          'Vue',
          'editor',
          'item',
          'vm',
        ],
      },
    ],
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'func-names': [
      'error',
      'never',
    ],
    'no-unused-vars': 'warn',
    'vue/order-in-components': ['error', {
      'order': [
        'el',
        'name',
        'parent',
        'functional',
        ['delimiters', 'comments'],
        ['components', 'directives', 'filters'],
        'extends',
        'mixins',
        'inheritAttrs',
        'model',
        ['props', 'propsData'],
        'fetch',
        'asyncData',
        'data',
        'computed',
        'watch',
        'LIFECYCLE_HOOKS',
        'methods',
        'head',
        ['template', 'render'],
        'renderError',
      ],
    }],
  },
}
