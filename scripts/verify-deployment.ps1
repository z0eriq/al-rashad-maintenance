param(
  [string]$BaseUrl = "http://localhost:3000"
)

$checks = @(
  @{ Name = "home"; Url = "$BaseUrl/" },
  @{ Name = "book"; Url = "$BaseUrl/book" },
  @{ Name = "contact"; Url = "$BaseUrl/contact" },
  @{ Name = "services"; Url = "$BaseUrl/services" },
  @{ Name = "admin-login"; Url = "$BaseUrl/admin/login" },
  @{ Name = "api-services"; Url = "$BaseUrl/api/services" },
  @{ Name = "logo"; Url = "$BaseUrl/al-rashad-logo.png" },
  @{ Name = "rate-qr"; Url = "$BaseUrl/rate-qr.png" }
)

Write-Host ""
Write-Host "Al-Rashad deployment check: $BaseUrl"
Write-Host ""

$passed = 0
foreach ($check in $checks) {
  try {
    $response = Invoke-WebRequest -Uri $check.Url -UseBasicParsing -TimeoutSec 30
    if ($response.StatusCode -eq 200) {
      Write-Host "[OK] $($check.Name)"
      $passed++
    } else {
      Write-Host "[WARN] $($check.Name) status $($response.StatusCode)"
    }
  } catch {
    Write-Host "[FAIL] $($check.Name)"
  }
}

try {
  $services = Invoke-RestMethod "$BaseUrl/api/services"
  $serviceId = $services.data.services[0].id
  $availability = Invoke-RestMethod "$BaseUrl/api/availability?date=2026-06-15&serviceId=$serviceId"
  if ($availability.success -and $availability.data.slots.Count -gt 0) {
    Write-Host "[OK] api-availability ($($availability.data.slots.Count) slots)"
    $passed++
  } else {
    Write-Host "[WARN] api-availability empty"
  }
} catch {
  Write-Host "[FAIL] api-availability"
}

$total = $checks.Count + 1
Write-Host ""
Write-Host "Result: $passed / $total passed"
