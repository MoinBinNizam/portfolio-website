#!/usr/bin/env bash
# Usage: ./issues-create.sh OWNER/REPO
# Requires: GitHub CLI (gh), authenticated with `gh auth login`.
# Creates labels, milestones, and issues in order. Issue numbers are assigned by GitHub.
set -euo pipefail
REPO="${1:?Usage: $0 OWNER/REPO}"
HERE="$(cd "$(dirname "$0")" && pwd)"

echo "Creating labels..."
tail -n +2 "$HERE/labels.txt" | while IFS='|' read -r name color desc; do
  gh label create "$name" --repo "$REPO" --color "$color" --description "$desc" --force >/dev/null
done

echo "Creating milestones..."
for d in 1 2 3 4 5 6 7 8 9 10; do
  gh api "repos/$REPO/milestones" -f title="Day $d" >/dev/null 2>&1 || true
done
gh api "repos/$REPO/milestones" -f title="Phase 2" >/dev/null 2>&1 || true

echo "Creating issues..."
INDEX="$HERE/ISSUES_INDEX.md"
{
  echo "# Issue index for $REPO"
  echo
  echo "| # | Milestone | Title |"
  echo "|---|---|---|"
} > "$INDEX"

tail -n +2 "$HERE/issues.tsv" | while IFS=$'\t' read -r day labels title body; do
  if [ "$day" = "phase-2" ]; then ms="Phase 2"; else ms="Day $day"; fi
  url=$(gh issue create --repo "$REPO" --title "$title" --body "$body" \
        --label "$labels" --milestone "$ms")
  num="${url##*/}"
  echo "| #$num | $ms | $title |" >> "$INDEX"
  echo "#$num  $title"
done

echo "Done. Index written to $INDEX"
