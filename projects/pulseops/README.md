# PulseOps ??

API REST para cat?logo de servi?os, registro de incidentes, ciclo de resolu??o e indicadores de opera??o. Persist?ncia SQLite, autentica??o por chave nas escritas, valida??o Pydantic, OpenAPI e testes de integra??o.

## Rodar localmente

1. Crie um ambiente Python 3.11+ e instale: pip install -r requirements.txt
2. Configure a vari?vel PULSEOPS_API_KEY com um segredo aleat?rio forte.
3. Inicie: uvicorn app.main:app --reload
4. Documenta??o interativa: http://localhost:8000/docs

## Endpoints

| M?todo | Rota | Uso |
|---|---|---|
| GET | /health | Healthcheck |
| GET/POST | /services | Listar/cadastrar servi?o |
| GET/POST | /incidents | Listar/criar incidente |
| PATCH | /incidents/{id} | Atualizar status |
| GET | /metrics | Resumo de incidentes |

Escritas exigem header X-API-Key. Status: investigating, identified, monitoring, resolved.

## Testar
pytest -q

## Deploy
Docker build: docker build -t pulseops .
Executar com segredo no ambiente e volume persistente para /data. Nunca commitar segredos.

## Limites de escopo
Demo de portf?lio, n?o indicada para exposi??o p?blica sem rate limiting, HTTPS, gest?o de usu?rios, observabilidade e migra??es SQL. N?o faz varreduras autom?ticas de URLs cadastradas.

**Stack:** FastAPI, Pydantic, SQLite, Pytest, Docker. **Licen?a:** MIT.

## Demo web
A pasta demo/ oferece uma simulacao interativa, local e sem backend da interface de incidentes. Nao eh a API FastAPI em producao. Para a API real, rode localmente ou hospede um servico Python e configure HTTPS e o banco persistente. Habilite **Settings > Pages > Source: GitHub Actions** no repositorio separado para disponibilizar o demo em https://santdevfull.github.io/pulseops/ apos sucesso do deploy.
