SRCS		= index.txt			\
		  getting_started.txt		\
		  download.txt			\
		  docs.txt			\
		  docs/prototype.txt		\
		  docs/core.txt			\
		  docs/bootstrap_config.txt	\
		  modules.txt			\


HTML		= $(SRCS:.txt=.html)
INSTALLED	= $(addprefix $(INSTALLDIR)/,$(HTML))

.PHONY: all clean fclean re install install-files

all: $(HTML)

##$(HTML): $(SRCS)

%.html:%.txt
	@echo "$< -> $@"
	@asciidoc -b xhtml11 -o $@ $<

clean:
	rm -f $(HTML)

install-files: $(INSTALLED)
	cp -r --parents $(HTML) $(INSTALLDIR)


$(INSTALLED): $(HTML)
	@echo "installing $@ into $(INSTALLDIR)"
	@mkdir -p `dirname $@`

install: install-files

fclean: clean

re: fclean all

