# Create three public GitHub repositories and publish locally validated projects.
# Requirements: GitHub CLI (gh), authenticated: gh auth login
# Run in PowerShell: ./PUBLISH_STANDALONE.ps1
$ErrorActionPreference = 'Stop'
if (-not (Get-Command gh -ErrorAction SilentlyContinue)) { throw 'Install GitHub CLI: https://cli.github.com/' }
gh auth status
if ($LASTEXITCODE -ne 0) { throw 'Authenticate with gh auth login before publishing.' }
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
foreach ($name in @('habitflow','budgetlab','pulseops')) {
  $path = Join-Path $root $name
  if (-not (Test-Path (Join-Path $path '.git'))) {
    git -C $path init -b main
    git -C $path config user.name 'santdevfull'
    git -C $path config user.email '323734247+santdevfull@users.noreply.github.com'
    git -C $path add .
    git -C $path commit -m 'feat: independent portfolio project with CI and Pages'
    git -C $path remote add origin ('https://github.com/santdevfull/' + $name + '.git')
    if ($LASTEXITCODE -ne 0) { throw ('Could not prepare local repository: ' + $name) }
  }
  gh repo view ('santdevfull/' + $name) --json name *> $null
  if ($LASTEXITCODE -ne 0) {
    gh repo create ('santdevfull/' + $name) --public --description ('Open-source portfolio project: ' + $name)
    if ($LASTEXITCODE -ne 0) { throw ('Failed to create repository: ' + $name) }
  }
  git -C $path push -u origin main
  if ($LASTEXITCODE -ne 0) { throw ('Failed to push: ' + $name) }
  Write-Host ('PUBLISHED: https://github.com/santdevfull/' + $name)
}
Write-Host 'NEXT: Enable Settings > Pages > Source: GitHub Actions in each new repository.'
