
DESTDIR		?= /usr/local/share/doc/pyjs
JS_SRCS		= $(wildcard ../pyjs/*.js)
JS_SRCS		+= $(wildcard ../pyjs/*/*.js)
JS_SRCS		+= $(wildcard ../pyjs/*/*/*.js)
JS_SRCS		+= $(wildcard ../pyjs/*/*/*/*.js)

SRCS		= index.txt			\
		  getting_started.txt		\
		  debug_testing.txt		\
		  download.txt			\
		  docs.txt			\
		  docs/prototype.txt		\
		  docs/core.txt			\
		  docs/bootstrap_config.txt	\
		  modules.txt			\

HTML		= $(SRCS:.txt=.html)
INSTALLED	= $(addprefix $(DESTDIR)/,$(HTML))

.PHONY: all clean fclean re install install-files

all: $(HTML) reference sandbox/pyjs

##$(HTML): $(SRCS)

%.html:%.txt
	@echo "$< -> $@"
	@asciidoc -b xhtml11 -o $@ $<

clean:
	rm -f $(HTML)

$(INSTALLED): $(HTML)
	@echo "installing $@ into $(DESTDIR)"
	@mkdir -p `dirname $@`

install-files: $(INSTALLED)
	cp -r --parents $(HTML) $(DESTDIR)

reference: $(JS_SRCS)
	rm -rf reference
	java \
		-jar ../jsdoc-toolkit/jsrun.jar \
		../jsdoc-toolkit/app/run.js \
		-t=../jsdoc-toolkit/templates/jsdoc \
		-d=reference \
		../pyjs \
		-e=utf8 -r -p\

sandbox/pyjs: $(JS_SRCS)
	rm -rf sandbox/pyjs
	cp -r ../pyjs sandbox/

$(DESTDIR)/sandbox: sandbox/pyjs sandbox/index.html
	cp -r sandbox $(DESTDIR)

$(DESTDIR)/reference: reference
	cp -r reference $(DESTDIR)

install: install-files $(DESTDIR)/reference $(DESTDIR)/sandbox

fclean: clean
	rm -rf reference
	rm -rf sandbox/pyjs

re: fclean all

