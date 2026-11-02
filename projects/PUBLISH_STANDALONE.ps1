# Publica os tres projetos independentes e configura GitHub Pages.
# Requer autorizacao do usuario no navegador na primeira execucao.
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$owner = 'santdevfull'

# Instalacoes novas do winget nao atualizam o PATH de uma sessao PowerShell ja aberta.
$ghPath = (Get-Command gh -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Source -First 1)
if (-not $ghPath) {
  foreach ($candidate in @(
    'C:\Program Files\GitHub CLI\gh.exe',
    'C:\Program Files (x86)\GitHub CLI\gh.exe',
    (Join-Path $env:LOCALAPPDATA 'Programs\GitHub CLI\gh.exe')
  )) {
    if (Test-Path -LiteralPath $candidate) {
      $ghPath = $candidate
      $env:Path = (Split-Path -Parent $candidate) + ';' + $env:Path
      break
    }
  }
}
if (-not $ghPath) { throw 'GitHub CLI nao encontrado. Instale via winget install --id GitHub.cli --exact.' }
Write-Host ('GitHub CLI: ' + $ghPath)
function Test-Gh {
  param([string[]]$CliArgs)
  $old = $ErrorActionPreference
  $ErrorActionPreference = 'SilentlyContinue'
  try {
    & $ghPath @CliArgs *> $null
    return ($LASTEXITCODE -eq 0)
  } finally {
    $ErrorActionPreference = $old
  }
}
if (-not (Test-Gh @('auth','status'))) {
  Write-Host 'Autenticacao GitHub necessaria. Autorize no navegador que abrir.' -ForegroundColor Yellow
  & $ghPath auth login --hostname github.com --git-protocol https --web
  if ($LASTEXITCODE -ne 0) { throw 'Login GitHub nao concluido.' }
}
$login = (& $ghPath api user --jq '.login').Trim()
if ($LASTEXITCODE -ne 0 -or $login -ne $owner) { throw ('Conta autenticada: ' + $login + '. Necessaria: ' + $owner) }
Write-Host ('Autenticado como ' + $login) -ForegroundColor Green

foreach ($name in @('habitflow','budgetlab','pulseops')) {
  $repo = $owner + '/' + $name
  $local = Join-Path $root $name
  if (-not (Test-Path -LiteralPath $local)) { throw ('Pasta nao encontrada: ' + $local) }
  if (-not (Test-Path -LiteralPath (Join-Path $local '.git'))) {
    git -C $local init -b main
    if ($LASTEXITCODE -ne 0) { throw ('git init falhou: ' + $name) }
    git -C $local config user.name $owner
    git -C $local config user.email '323734247+santdevfull@users.noreply.github.com'
    git -C $local add .
    git -C $local commit -m 'feat: standalone portfolio application, CI and GitHub Pages'
    if ($LASTEXITCODE -ne 0) { throw ('git commit falhou: ' + $name) }
  }

  if (-not (Test-Gh @('repo','view',$repo,'--json','name'))) {
    Write-Host ('Criando repositorio publico: ' + $repo)
    & $ghPath repo create $repo --public --description ('Portfolio app: ' + $name) --disable-wiki
    if ($LASTEXITCODE -ne 0) { throw ('Nao foi possivel criar ' + $repo) }
  } else { Write-Host ('Repositorio ja existe: ' + $repo) }

  $hasOrigin = (git -C $local remote) -contains 'origin'
  if (-not $hasOrigin) {

    git -C $local remote add origin ('https://github.com/' + $repo + '.git')
  } else {
    $origin = git -C $local remote get-url origin
    if ($origin -ne ('https://github.com/' + $repo + '.git')) {
      throw ('Origin inesperada para ' + $name + ': ' + $origin)
    }
  }
  git -C $local push -u origin main
  if ($LASTEXITCODE -ne 0) { throw ('Push falhou: ' + $repo) }
  Write-Host ('Codigo publicado: https://github.com/' + $repo) -ForegroundColor Green

  # Habilita GitHub Pages baseado no workflow (sem branch gh-pages).
  if (-not (Test-Gh @('api',('repos/' + $repo + '/pages'),'--jq','.build_type'))) {
    & $ghPath api --method POST ('repos/' + $repo + '/pages') -f build_type=workflow --silent
    if ($LASTEXITCODE -ne 0) {
      Write-Warning ('Nao foi possivel habilitar Pages via API em ' + $repo + '. Configure Settings > Pages > Source: GitHub Actions.')
      continue
    }
  } else {
    & $ghPath api --method PUT ('repos/' + $repo + '/pages') -f build_type=workflow --silent
    if ($LASTEXITCODE -ne 0) { Write-Warning ('Revise Pages > Build and deployment em ' + $repo) }
  }
  Write-Host ('Pages configurado: https://' + $owner + '.github.io/' + $name + '/')
  & $ghPath workflow run pages.yml --repo $repo --ref main
  if ($LASTEXITCODE -ne 0) {
    Write-Warning ('Nao foi possivel disparar Pages agora para ' + $repo + '. O proximo push ou workflow_dispatch pode publica-lo.')
  }
}
Write-Host 'Confira a conclusao em cada repositorio > Actions antes de divulgar as URLs.' -ForegroundColor Cyan

