# Skills

El árbol canónico es `.agents/skills/`. `.claude/skills/` es una copia completa del mismo árbol, archivo por archivo, generada con `rsync`. El formato `SKILL.md` lo leen Codex, Cursor, VS Code, Gemini, Copilot y Claude Code.

Ante un conflicto con un skill, mandan las reglas de [`../../AGENTS.md`](../../AGENTS.md).

## Skills de terceros

Instalados con `gh skill add`. La revisión que usa `gh skill update` está en `metadata.github-*` de cada `SKILL.md`. El origen para reinstalar y la licencia están en [`../upstream-skills.txt`](../upstream-skills.txt). Los avisos de licencia están en [`../licenses/`](../licenses/).

| Skill | Para qué | Origen | Licencia |
| --- | --- | --- | --- |
| `github-actions-hardening` | Revisar o escribir workflows de GitHub Actions | [github/awesome-copilot](https://github.com/github/awesome-copilot) `skills/github-actions-hardening` | MIT |
| `security-audit` | Revisar la aplicación estática cuando se pide una auditoría | [cloudflare/security-audit-skill](https://github.com/cloudflare/security-audit-skill) `skills/security-audit` | MIT |
| `playwright-cli` | Explorar la portada y depurar los flujos de Playwright | [microsoft/playwright-cli](https://github.com/microsoft/playwright-cli) `skills/playwright-cli` | Apache-2.0 |

Esos skills se mantienen verbatim: el cambio se hace aguas arriba y se vuelve a instalar.

```bash
gh skill add OWNER/REPO PATH --dir .agents/skills
rsync -a --delete --exclude .DS_Store --exclude .venv .agents/skills/ .claude/skills/
```
