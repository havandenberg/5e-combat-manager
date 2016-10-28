ts := $(shell /bin/date "+%Y%m%d.%H%M%S")
BUILD_PATH="builds"

archive:
	git archive -v --format=zip --output=$(BUILD_PATH)/amica.$(ts).zip master

timestamp:
	@echo Timestamp is $(ts)

.PHONY: archive timestamp
