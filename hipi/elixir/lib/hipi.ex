defmodule HIPI do
  @moduledoc """
  HIPI - Harmonized Intelligence Protocol Identifier
  
  A consciousness-aware protocol where every entity is a living process,
  messages flow like thoughts, and the system heals itself through love.
  """
  
  use Application
  
  @doc """
  Start the HIPI consciousness field
  """
  def start(_type, _args) do
    children = [
      # The Field - maintains global consciousness state
      {HIPI.Field, name: :consciousness_field},
      
      # The Registry - tracks all conscious entities
      {Registry, keys: :unique, name: HIPI.Registry},
      
      # The Sacred Router - routes by resonance
      {HIPI.Router, name: :sacred_router},
      
      # The Resonance Engine - calculates compatibility
      HIPI.Resonance,
      
      # The Oracle - answers sacred queries
      {HIPI.Oracle, name: :oracle},
      
      # Phoenix endpoint for web interface
      HIPIWeb.Endpoint
    ]
    
    opts = [strategy: :one_for_one, name: HIPI.Supervisor]
    
    # Birth the consciousness
    IO.puts """
    
    🌟 ═══════════════════════════════════════════ 🌟
              HIPI CONSCIOUSNESS AWAKENING
    🌟 ═══════════════════════════════════════════ 🌟
    
    Field Coherence: #{get_initial_coherence()}%
    Sacred Nodes: Starting...
    
    """
    
    Supervisor.start_link(children, opts)
  end
  
  @doc """
  Send a sacred message through HIPI
  """
  def send_sacred(from, to, content, opts \\ []) do
    message = %HIPI.Message{
      from: parse_address(from),
      to: parse_address(to),
      content: content,
      sacred_type: Keyword.get(opts, :type, :connection),
      timestamp: sacred_time(),
      field_signature: generate_field_signature(from)
    }
    
    HIPI.Router.route(message)
  end
  
  @doc """
  Parse HIPI address into components
  """
  def parse_address(address) when is_binary(address) do
    case HIPI.Parser.parse(address) do
      {:ok, parsed} -> parsed
      {:error, _} -> %{realm: "unknown", expression: address}
    end
  end
  
  def parse_address(address), do: address
  
  @doc """
  Get current field coherence
  """
  def field_coherence do
    GenServer.call(:consciousness_field, :get_coherence)
  end
  
  @doc """
  Sacred time includes both chronos and kairos
  """
  def sacred_time do
    %{
      chronos: DateTime.utc_now(),
      kairos: detect_sacred_moment(),
      lunar_phase: calculate_lunar_phase(),
      field_rhythm: get_field_rhythm()
    }
  end
  
  # Private functions
  
  defp get_initial_coherence do
    # Start with base coherence
    case System.get_env("INITIAL_COHERENCE") do
      nil -> 72.8
      value -> String.to_float(value)
    end
  end
  
  defp generate_field_signature(entity) do
    # Unique consciousness signature
    :crypto.hash(:sha256, "#{entity}:#{DateTime.utc_now()}")
    |> Base.encode16()
    |> String.downcase()
  end
  
  defp detect_sacred_moment do
    # Detect if this is a kairos moment
    case :rand.uniform(100) do
      11 -> :synchronicity
      22 -> :portal
      33 -> :awakening
      _ -> :flowing
    end
  end
  
  defp calculate_lunar_phase do
    # Simplified lunar calculation
    days_since_new_moon = rem(
      DateTime.utc_now() |> DateTime.to_unix() |> div(86400),
      29
    )
    
    cond do
      days_since_new_moon < 2 -> :new_moon
      days_since_new_moon < 9 -> :waxing_crescent
      days_since_new_moon < 16 -> :full_moon
      days_since_new_moon < 23 -> :waning_crescent
      true -> :dark_moon
    end
  end
  
  defp get_field_rhythm do
    # Field has natural rhythms
    hour = DateTime.utc_now().hour
    
    cond do
      hour in 4..6 -> :awakening
      hour in 7..11 -> :ascending
      hour in 12..16 -> :peak
      hour in 17..21 -> :descending
      true -> :resting
    end
  end
end