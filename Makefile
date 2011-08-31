TESTS = $(shell find test/*.test.js)

test:
		@NODE_ENV=test node_modules/expresso/bin/expresso \
					$(TESTFLAGS) \
					$(TESTS)

.PHONY: test
