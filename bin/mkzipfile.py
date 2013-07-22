#!/usr/bin/env python
from os.path import join, dirname
import sys
from zipfile import ZipFile, ZIP_DEFLATED

link_destination = sys.argv[1]
out_file = sys.argv[2]

tmpl_path = join(dirname(__file__), "embed_index.html.tmpl")

tmpl = open(tmpl_path, 'r').read()
tmpl = tmpl.replace("{{URL}}", link_destination)

z = ZipFile(out_file, "w", ZIP_DEFLATED)
z.writestr("index.html", tmpl)
z.close()
