#!/usr/bin/env python3
"""Versiona TODOS os imports internos da Etapa 3 de uma vez.
Uso: python3 versionar.py 6     (depois de qualquer alteração, antes do deploy)
Sem isso, o navegador do aluno pode misturar arquivo novo com arquivo antigo em cache."""
import io, re, sys, pathlib
v = sys.argv[1] if len(sys.argv) > 1 else "1"
alvos = ["app3.js", "ui3.js", "motor3.js", "arte3.js", "cenarios3.js", "index.html"]
# qualquer caminho relativo .js/.css nossos, com ou sem ?v= anterior
padrao = re.compile(r'(["\'])((?:\.{1,2}/)?[A-Za-z0-9_\-/]+\.(?:js|css))(?:\?v=[^"\']*)?\1')
for nome in alvos:
    p = pathlib.Path(nome)
    if not p.exists(): continue
    s = io.open(p, encoding="utf-8").read()
    novo = padrao.sub(lambda m: f'{m.group(1)}{m.group(2)}?v={v}{m.group(1)}', s)
    if novo != s:
        io.open(p, "w", encoding="utf-8").write(novo)
        print(f"  {nome}: {len(padrao.findall(s))} referência(s) -> ?v={v}")
print(f"versão {v} aplicada")
