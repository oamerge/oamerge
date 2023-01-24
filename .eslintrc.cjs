module.exports = {
	extends: [ 'eslint:recommended' ],
	env: {
		es2021: true,
		node: true,
	},
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
	},
	overrides: [
		{
			files: [
				'*.js',
			],
			rules: {
				'array-bracket-spacing': [
					'error',
					'always',
					{
						'objectsInArrays': true,
						'arraysInArrays': true,
					},
				],
				'block-spacing': [
					'error',
					'always',
				],
				'brace-style': [
					'error',
					'1tbs',
					{
						'allowSingleLine': true,
					},
				],
				'comma-dangle': [
					'error',
					'always-multiline',
				],
				'comma-spacing': [
					'error',
					{
						'before': false,
						'after': true,
					},
				],
				'eol-last': [
					'error',
					'always',
				],
				'eqeqeq': [
					'error',
					'always',
				],
				'indent': [
					'error',
					'tab',
				],
				'keyword-spacing': [
					'error',
					{
						'before': true,
					},
				],
				'linebreak-style': [
					'error',
					'unix',
				],
				// This is the list from the mutate-console-logger, only these console
				// statements are supported in OA Merge.
				'no-console': [ 'error', { allow: [ 'warn', 'debug', 'info', 'error' ] }],
				'no-eval': 'error',
				'no-implied-eval': 'error',
				'no-irregular-whitespace': [
					'error',
					{
						'skipStrings': false,
					},
				],
				'no-new': 'error',
				'no-return-await': 'error',
				'no-unexpected-multiline': 'error',
				'no-useless-rename': 'error',
				'no-var': [
					'error',
				],
				'object-curly-spacing': [
					'error',
					'always',
				],
				'quotes': [
					'error',
					'single',
					{
						'avoidEscape': true,
					},
				],
				'semi': [
					'error',
					'never',
				],
				'space-before-blocks': [
					'error',
					'always',
				],
				'space-before-function-paren': [
					'error',
					{
						'anonymous': 'always',
						'asyncArrow': 'always',
						'named': 'never',
					},
				],
				'space-in-parens': [
					'error',
					'never',
				],
				'valid-jsdoc': [
					'error',
					{
						'requireReturn': false,
					},
				],
			},
		},
	],
}


