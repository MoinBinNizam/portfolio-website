param(
  [string]$Repo = ''
)

$ErrorActionPreference = 'Stop'
$Here = Split-Path -Parent $MyInvocation.MyCommand.Path

if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
  Write-Host 'GitHub CLI (gh) is not installed.' -ForegroundColor Red
  Write-Host 'Install it with: winget install --id GitHub.cli'
  Write-Host 'Then sign in with: gh auth login'
  exit 1
}

gh auth status *> $null
if ($LASTEXITCODE -ne 0) {
  Write-Host 'GitHub CLI is not authenticated. Run: gh auth login' -ForegroundColor Red
  exit 1
}

if ([string]::IsNullOrWhiteSpace($Repo)) {
  $remoteUrl = (git remote get-url origin 2>$null)
  if ($remoteUrl -match 'github\.com[:/](.+?)(?:\.git)?$') {
    $Repo = $Matches[1]
  } else {
    Write-Host 'Could not detect GitHub repository from git remote origin.' -ForegroundColor Red
    Write-Host 'Pass it explicitly: .\create-issues.ps1 -Repo OWNER/REPO'
    exit 1
  }
}

Write-Host "Target repository: $Repo" -ForegroundColor Cyan

Write-Host 'Creating labels...'
$labelsLines = Get-Content (Join-Path $Here 'labels.txt') | Select-Object -Skip 1
foreach ($line in $labelsLines) {
  if ([string]::IsNullOrWhiteSpace($line)) { continue }
  $parts = $line -split '\|', 3
  $name = $parts[0]
  $color = $parts[1]
  $desc = $parts[2]
  gh label create $name --repo $Repo --color $color --description $desc --force | Out-Null
}

Write-Host 'Creating milestones...'
1..10 | ForEach-Object {
  gh api "repos/$Repo/milestones" -f "title=Day $_" *> $null
}
gh api "repos/$Repo/milestones" -f "title=Phase 2" *> $null

Write-Host 'Creating issues in order (#1, #2, #3...)...'
$indexFile = Join-Path $Here 'ISSUES_INDEX.md'
@(
  "# Issue index for $Repo"
  ''
  '| # | Milestone | Title |'
  '|---|---|---|'
) | Set-Content -Path $indexFile -Encoding UTF8

$issueLines = Get-Content (Join-Path $Here 'issues.tsv') | Select-Object -Skip 1
foreach ($line in $issueLines) {
  if ([string]::IsNullOrWhiteSpace($line)) { continue }
  $cols = $line -split "`t", 4
  $day = $cols[0]
  $labels = $cols[1]
  $title = $cols[2]
  $body = $cols[3]
  $ms = if ($day -eq 'phase-2') { 'Phase 2' } else { "Day $day" }

  $url = gh issue create --repo $Repo --title $title --body $body --label $labels --milestone $ms
  $num = ($url -split '/')[-1]
  Add-Content -Path $indexFile -Value "| #$num | $ms | $title |" -Encoding UTF8
  Write-Host "#$num  $title"
}

Write-Host "Done. Index written to $indexFile" -ForegroundColor Green
