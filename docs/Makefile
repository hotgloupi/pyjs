SRCS		= index.txt			\
		  getting_started.txt		\
		  download.txt			\
		  docs.txt			\
		  docs/prototype.txt		\
		  docs/core.txt			\
		  docs/bootstrap_config.txt	\
		  modules.txt			\


HTML		= $(SRCS:.txt=.html)

.PHONY: all clean fclean re

all: $(HTML)

##$(HTML): $(SRCS)

%.html:%.txt
	@echo "$< -> $@"
	@asciidoc -b xhtml11 -o $@ $<

clean:
	rm -f $(HTML)

fclean: clean

re: fclean all

