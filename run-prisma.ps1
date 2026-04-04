#!/bin/powershell
# Load .env file
if (Test-Path .env) {
    Get-Content .env | ForEach-Object {
        if ($_ -match '^\s*#' -or $_ -eq '') {
            return
        }
        $name, $value = $_.split('=', 2)
        $value = $value -replace '^["`'']|["`'']$'
        [Environment]::SetEnvironmentVariable($name, $value)
    }
}

# Run prisma command
& npm run prisma:migrate
