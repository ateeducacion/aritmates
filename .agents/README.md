# Agentes y skills

Los skills están en `.agents/skills/`. `.claude/skills/` es una copia completa del mismo árbol, sin enlaces simbólicos.

No hay skills locales. Un directorio sin `metadata.github-*` en `SKILL.md` lo omite `gh skill update`. El catálogo está en [`skills/README.md`](skills/README.md).

Los skills de terceros, su origen y la licencia están en [`upstream-skills.txt`](upstream-skills.txt). Los avisos de licencia están en [`licenses/`](licenses/). La actualización semanal es `.github/workflows/update-agent-skills.yml`. El detalle operativo está en [`../AGENTS.md`](../AGENTS.md).
