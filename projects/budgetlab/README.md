# BudgetLab ??

Dashboard financeiro local com receitas, despesas, balan?o, gr?fico de categorias e exporta??o CSV. Valores armazenados em centavos inteiros.

## Executar
Rode python -m http.server 8080 e abra http://localhost:8080.

## Testar
Rode node --test test.mjs (Node 20+).

**Stack:** HTML, CSS, JavaScript ES Modules. **Licen?a:** MIT. Dados apenas no navegador; n?o ? um servi?o financeiro.

## Publicar na Web
Em seu proprio repositorio publico, abra **Settings > Pages > Build and deployment > Source: GitHub Actions**. A cada push na branch main, o workflow pages.yml testa e publica automaticamente.
URL prevista: https://santdevfull.github.io/budgetlab/ (so funciona apos ativar Pages e concluir o primeiro deploy).
