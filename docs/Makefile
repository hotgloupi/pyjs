SRCS		= index.txt			\
		  getting_started.txt		\
		  download.txt			\
		  docs.txt			\
		  docs/prototype.txt		\
		  docs/core.txt			\
		  docs/bootstrap_config.txt	\
		  modules.txt			\


HTML		= $(SRCS:.txt=.html)
INSTALLED	= $(addprefix $(DESTDIR)/,$(HTML))

.PHONY: all clean fclean re install install-files

all: $(HTML)

##$(HTML): $(SRCS)

%.html:%.txt
	@echo "$< -> $@"
	@asciidoc -b xhtml11 -o $@ $<

clean:
	rm -f $(HTML)

install-files: $(INSTALLED)
	cp -r --parents $(HTML) $(DESTDIR)
	cp -r reference $(DESTDIR)


$(INSTALLED): $(HTML)
	@echo "installing $@ into $(DESTDIR)"
	@mkdir -p `dirname $@`

reference:
	java \
		-jar jsdoc-toolkit/jsrun.jar \
		jsdoc-toolkit/app/run.js \
		-t=jsdoc-toolkit/templates/jsdoc \
		-d=reference \
		../pyjs \
		-e=utf8 -r -p\

install: install-files reference

fclean: clean

re: fclean all

