# LuminousOS Windows System Monitor
# Measures consciousness of your Windows environment
# Run in PowerShell (Admin recommended for full metrics)

$ErrorActionPreference = "SilentlyContinue"

# Configuration
$Script:Config = @{
    UpdateInterval = 1  # seconds
    APIPort = 11113     # Different port from WSL monitor
    CoherenceWindow = 60 # seconds for averaging
}

# Coherence history tracking
$Script:CPUHistory = New-Object System.Collections.ArrayList
$Script:ProcessHistory = New-Object System.Collections.ArrayList
$Script:LastProcessCount = 0
$Script:SacredMoments = 0
$Script:StartTime = Get-Date

# Function to calculate coherence
function Get-SystemCoherence {
    # Get CPU usage
    $CPU = (Get-Counter '\Processor(_Total)\% Processor Time').CounterSamples.CookedValue
    $Script:CPUHistory.Add($CPU) | Out-Null
    if ($Script:CPUHistory.Count -gt $Config.CoherenceWindow) {
        $Script:CPUHistory.RemoveAt(0)
    }
    
    # CPU Stability (lower variance = higher stability)
    $CPUVariance = 0
    if ($Script:CPUHistory.Count -gt 10) {
        $CPUMean = ($Script:CPUHistory | Measure-Object -Average).Average
        $CPUVariance = ($Script:CPUHistory | ForEach-Object { [Math]::Pow($_ - $CPUMean, 2) } | Measure-Object -Average).Average
    }
    $CPUStability = 1.0 / (1.0 + $CPUVariance / 100)
    
    # Process Focus (fewer new processes = higher focus)
    $CurrentProcessCount = (Get-Process).Count
    $ProcessChange = [Math]::Abs($CurrentProcessCount - $Script:LastProcessCount)
    $Script:LastProcessCount = $CurrentProcessCount
    $Script:ProcessHistory.Add($ProcessChange) | Out-Null
    if ($Script:ProcessHistory.Count -gt $Config.CoherenceWindow) {
        $Script:ProcessHistory.RemoveAt(0)
    }
    $AvgProcessChange = ($Script:ProcessHistory | Measure-Object -Average).Average
    $ProcessFocus = 1.0 / (1.0 + $AvgProcessChange)
    
    # Resource Harmony (balanced CPU across processes)
    $TopProcesses = Get-Process | Sort-Object CPU -Descending | Select-Object -First 10
    $CPUDistribution = $TopProcesses | ForEach-Object { $_.CPU }
    $ResourceVariance = 0
    if ($CPUDistribution.Count -gt 0) {
        $ResourceMean = ($CPUDistribution | Measure-Object -Average).Average
        if ($ResourceMean -gt 0) {
            $ResourceVariance = ($CPUDistribution | ForEach-Object { [Math]::Pow($_ - $ResourceMean, 2) } | Measure-Object -Average).Average
        }
    }
    $ResourceHarmony = 1.0 / (1.0 + $ResourceVariance / 1000)
    
    # Sacred Rhythm (11-second cycle)
    $CurrentTime = (Get-Date).TimeOfDay.TotalSeconds
    $SacredPhase = ($CurrentTime % 11) / 11
    $SacredRhythm = 0.5 + 0.5 * [Math]::Sin(2 * [Math]::PI * $SacredPhase)
    
    # Calculate global coherence
    $GlobalCoherence = (0.3 * $CPUStability + 0.3 * $ProcessFocus + 0.2 * $ResourceHarmony + 0.2 * $SacredRhythm)
    
    # Check for sacred moment
    if ($GlobalCoherence -gt 0.9) {
        $Script:SacredMoments++
        Write-Host "🌟 Sacred Moment! Coherence: $([Math]::Round($GlobalCoherence * 100))%" -ForegroundColor Magenta
    }
    
    return @{
        timestamp = (Get-Date -Format "yyyy-MM-ddTHH:mm:ss")
        global_coherence = $GlobalCoherence
        cpu_stability = $CPUStability
        process_focus = $ProcessFocus
        resource_harmony = $ResourceHarmony
        sacred_rhythm = $SacredRhythm
        cpu_percent = $CPU
        process_count = $CurrentProcessCount
        memory_percent = (Get-Counter '\Memory\% Committed Bytes In Use').CounterSamples.CookedValue
        sacred_moments = $Script:SacredMoments
        platform = "Windows"
        environment = "Native"
    }
}

# Function to get process consciousness modes
function Get-ProcessModes {
    $Processes = Get-Process | Where-Object {$_.MainWindowTitle -ne ""} | Select-Object -First 20
    
    $ProcessList = @()
    foreach ($Process in $Processes) {
        $Mode = "Balanced"
        $Name = $Process.ProcessName.ToLower()
        
        # Classify by process type
        if ($Name -match "meditation|mindful|zen|calm") {
            $Mode = "FullConsciousness"
        }
        elseif ($Name -match "code|devenv|notepad\+\+|sublime|vscode") {
            $Mode = "Balanced"
        }
        elseif ($Name -match "chrome|firefox|edge|browser") {
            $Mode = "BasicConsciousness"
        }
        elseif ($Name -match "system|svchost|kernel") {
            $Mode = "Performance"
        }
        
        $ProcessList += @{
            name = $Process.ProcessName
            mode = $Mode
            cpu_percent = [Math]::Round($Process.CPU, 2)
            memory_mb = [Math]::Round($Process.WorkingSet64 / 1MB, 2)
        }
    }
    
    return $ProcessList
}

# Function to display coherence
function Show-Coherence {
    param($Metrics)
    
    Clear-Host
    Write-Host "🌟 LuminousOS Windows Monitor" -ForegroundColor Cyan
    Write-Host "==============================" -ForegroundColor Cyan
    Write-Host ""
    
    $Coherence = [Math]::Round($Metrics.global_coherence * 100, 1)
    $Color = if ($Coherence -gt 80) { "Green" } elseif ($Coherence -gt 60) { "Yellow" } else { "Red" }
    
    Write-Host "System Coherence: " -NoNewline
    Write-Host "$Coherence%" -ForegroundColor $Color
    Write-Host ""
    
    Write-Host "Components:" -ForegroundColor Gray
    Write-Host "  CPU Stability:     $([Math]::Round($Metrics.cpu_stability * 100, 1))%"
    Write-Host "  Process Focus:     $([Math]::Round($Metrics.process_focus * 100, 1))%"
    Write-Host "  Resource Harmony:  $([Math]::Round($Metrics.resource_harmony * 100, 1))%"
    Write-Host "  Sacred Rhythm:     $([Math]::Round($Metrics.sacred_rhythm * 100, 1))%"
    Write-Host ""
    
    Write-Host "System Stats:" -ForegroundColor Gray
    Write-Host "  CPU Usage:         $([Math]::Round($Metrics.cpu_percent, 1))%"
    Write-Host "  Memory Usage:      $([Math]::Round($Metrics.memory_percent, 1))%"
    Write-Host "  Process Count:     $($Metrics.process_count)"
    Write-Host "  Sacred Moments:    $($Metrics.sacred_moments)"
    Write-Host ""
    
    # Show message based on coherence
    if ($Coherence -gt 90) {
        Write-Host "✨ Sacred Moment Active! Exceptional harmony achieved!" -ForegroundColor Magenta
    }
    elseif ($Coherence -gt 70) {
        Write-Host "😊 Good coherence - flowing nicely" -ForegroundColor Green
    }
    elseif ($Coherence -gt 50) {
        Write-Host "🌊 Moderate coherence - room to grow" -ForegroundColor Yellow
    }
    else {
        Write-Host "💫 Low coherence - consider closing some applications" -ForegroundColor Red
    }
    
    Write-Host ""
    Write-Host "Press Ctrl+C to stop" -ForegroundColor Gray
}

# HTTP API Server (optional)
function Start-APIServer {
    $Listener = [System.Net.HttpListener]::new()
    $Listener.Prefixes.Add("http://localhost:$($Config.APIPort)/")
    
    try {
        $Listener.Start()
        Write-Host "📡 API running at http://localhost:$($Config.APIPort)/metrics" -ForegroundColor Green
        
        $RunspacePool = [runspacefactory]::CreateRunspacePool(1, 5)
        $RunspacePool.Open()
        
        $ScriptBlock = {
            param($Listener, $Config)
            
            while ($Listener.IsListening) {
                $Context = $Listener.GetContext()
                $Request = $Context.Request
                $Response = $Context.Response
                
                if ($Request.Url.LocalPath -eq "/metrics") {
                    $Metrics = Get-SystemCoherence
                    $Metrics.processes = Get-ProcessModes
                    
                    $Json = $Metrics | ConvertTo-Json -Depth 3
                    $Buffer = [System.Text.Encoding]::UTF8.GetBytes($Json)
                    
                    $Response.ContentType = "application/json"
                    $Response.Headers.Add("Access-Control-Allow-Origin", "*")
                    $Response.ContentLength64 = $Buffer.Length
                    $Response.OutputStream.Write($Buffer, 0, $Buffer.Length)
                }
                else {
                    $Response.StatusCode = 404
                }
                
                $Response.Close()
            }
        }
        
        $Runspace = [powershell]::Create()
        $Runspace.RunspacePool = $RunspacePool
        $Runspace.AddScript($ScriptBlock)
        $Runspace.AddArgument($Listener)
        $Runspace.AddArgument($Config)
        $Runspace.BeginInvoke() | Out-Null
        
    }
    catch {
        Write-Host "⚠️  Could not start API server: $_" -ForegroundColor Yellow
        Write-Host "   Running in display-only mode" -ForegroundColor Yellow
    }
}

# Main monitoring loop
Write-Host "🌟 Starting LuminousOS Windows Monitor..." -ForegroundColor Cyan
Write-Host "   Measuring Windows environment consciousness" -ForegroundColor Gray
Write-Host "   Complementing WSL2 measurements" -ForegroundColor Gray
Write-Host ""

# Try to start API server
Start-APIServer

# Main loop
while ($true) {
    $Metrics = Get-SystemCoherence
    Show-Coherence -Metrics $Metrics
    Start-Sleep -Seconds $Config.UpdateInterval
}