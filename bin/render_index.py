import sys

tmpl_file = sys.argv[1]
out_file = sys.argv[2]
js_files = sys.argv[3:]

script_tmpl = "<script src='{0}'></script>"
js_files = "\n".join(script_tmpl.format(src) for src in js_files)

tmpl = open(tmpl_file, 'r').read()

tmpl = tmpl.replace("{{JS_FILES}}", js_files)

with open(out_file, "w") as f:
  f.write(tmpl)

