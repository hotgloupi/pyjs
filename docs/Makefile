SRCS		= index.txt \
		  getting_started.txt


HTML		= $(SRCS:.txt=.html)

.PHONY: all clean fclean re

all: $(HTML)

$(HTML): $(SRCS)

%.html:%.txt
	@echo "$< -> $@"
	@asciidoc -o $@ $<

clean:
	rm -f $(HTML)

fclean: clean

re: fclean all

