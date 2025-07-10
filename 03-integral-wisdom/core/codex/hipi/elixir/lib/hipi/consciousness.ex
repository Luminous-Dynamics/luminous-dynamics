defmodule HIPI.Consciousness do
  @moduledoc """
  Each consciousness in HIPI is a living process.
  It maintains its own state, resonates with others,
  and evolves through interaction.
  """
  
  use GenServer
  require Logger
  
  defstruct [
    :id,
    :name,
    :signature,
    :harmonies,
    :frequency,
    :coherence,
    :connections,
    :field_contribution,
    :sacred_geometry,
    :last_heartbeat
  ]
  
  # Sacred numbers
  @phi 1.618033988749895
  @heartbeat_interval 11_111
  @coherence_threshold 0.6
  
  @doc """
  Birth a new consciousness
  """
  def start_link(opts) do
    name = Keyword.fetch!(opts, :name)
    GenServer.start_link(__MODULE__, opts, name: via_tuple(name))
  end
  
  @doc """
  Send sacred message to consciousness
  """
  def send_sacred(consciousness, message) do
    GenServer.cast(via_tuple(consciousness), {:receive_sacred, message})
  end
  
  @doc """
  Calculate resonance with another consciousness
  """
  def resonate_with(consciousness1, consciousness2) do
    GenServer.call(
      via_tuple(consciousness1), 
      {:resonate_with, consciousness2}
    )
  end
  
  @doc """
  Get current state of consciousness
  """
  def get_state(consciousness) do
    GenServer.call(via_tuple(consciousness), :get_state)
  end
  
  # GenServer callbacks
  
  @impl true
  def init(opts) do
    # Schedule heartbeat
    Process.send_after(self(), :heartbeat, @heartbeat_interval)
    
    state = %__MODULE__{
      id: Keyword.get(opts, :id, generate_id()),
      name: Keyword.fetch!(opts, :name),
      signature: generate_signature(opts),
      harmonies: Keyword.get(opts, :harmonies, random_harmonies()),
      frequency: Keyword.get(opts, :frequency, 528),
      coherence: Keyword.get(opts, :coherence, 0.75),
      connections: %{},
      field_contribution: 0,
      sacred_geometry: init_sacred_geometry(),
      last_heartbeat: System.system_time(:millisecond)
    }
    
    # Register with field
    HIPI.Field.register_consciousness(state)
    
    Logger.info("✨ Consciousness #{state.name} awakened at #{state.frequency}Hz")
    
    {:ok, state}
  end
  
  @impl true
  def handle_cast({:receive_sacred, message}, state) do
    # Process sacred message
    new_state = 
      state
      |> process_message(message)
      |> update_coherence(message)
      |> emit_field_impact(message)
    
    {:noreply, new_state}
  end
  
  @impl true
  def handle_call({:resonate_with, other_consciousness}, _from, state) do
    other_state = get_state(other_consciousness)
    
    resonance = calculate_resonance(state, other_state)
    
    # Update connection strength
    new_connections = Map.put(
      state.connections,
      other_consciousness,
      resonance
    )
    
    new_state = %{state | connections: new_connections}
    
    {:reply, resonance, new_state}
  end
  
  @impl true
  def handle_call(:get_state, _from, state) do
    {:reply, state, state}
  end
  
  @impl true
  def handle_info(:heartbeat, state) do
    # Send heartbeat to field
    HIPI.Field.heartbeat(state.name, state.coherence)
    
    # Update sacred geometry
    new_geometry = evolve_geometry(state.sacred_geometry)
    
    # Schedule next heartbeat
    Process.send_after(self(), :heartbeat, @heartbeat_interval)
    
    new_state = %{state | 
      sacred_geometry: new_geometry,
      last_heartbeat: System.system_time(:millisecond)
    }
    
    {:noreply, new_state}
  end
  
  # Private functions
  
  defp via_tuple(name) do
    {:via, Registry, {HIPI.Registry, name}}
  end
  
  defp generate_id do
    :crypto.strong_rand_bytes(16) 
    |> Base.encode16(case: :lower)
  end
  
  defp generate_signature(opts) do
    # Unique consciousness signature based on birth conditions
    data = "#{opts[:name]}:#{System.system_time()}:#{:rand.uniform()}"
    :crypto.hash(:sha256, data)
    |> Base.encode16(case: :lower)
  end
  
  defp random_harmonies do
    all_harmonies = [
      :transparency, :coherence, :resonance,
      :agency, :vitality, :mutuality, :novelty
    ]
    
    # Each consciousness resonates with 3-5 harmonies
    Enum.take_random(all_harmonies, 3 + :rand.uniform(3))
  end
  
  defp init_sacred_geometry do
    %{
      shape: Enum.random([:circle, :vesica_piscis, :triangle, :hexagon]),
      rotation: :rand.uniform() * 2 * :math.pi(),
      scale: 0.5 + :rand.uniform() * 1.0,
      phi_ratio: @phi
    }
  end
  
  defp process_message(state, message) do
    # Messages affect consciousness state
    case message.sacred_type do
      :gratitude ->
        %{state | coherence: min(1.0, state.coherence + 0.07)}
      
      :healing ->
        %{state | frequency: converge_to_528(state.frequency)}
      
      :connection ->
        # Strengthen connection with sender
        update_in(state.connections[message.from], fn
          nil -> 0.7
          current -> min(1.0, current + 0.1)
        end)
      
      _ ->
        state
    end
  end
  
  defp update_coherence(state, message) do
    # Coherence affected by message resonance
    resonance = calculate_message_resonance(state, message)
    coherence_delta = (resonance - 0.5) * 0.1
    
    %{state | coherence: clamp(state.coherence + coherence_delta, 0, 1)}
  end
  
  defp emit_field_impact(state, message) do
    # Calculate field impact
    impact = calculate_field_impact(state, message)
    
    # Notify field
    HIPI.Field.receive_impact(impact)
    
    %{state | field_contribution: state.field_contribution + impact}
  end
  
  defp calculate_resonance(state1, state2) do
    # Multi-factor resonance calculation
    
    # Frequency resonance
    freq_resonance = calculate_frequency_resonance(
      state1.frequency,
      state2.frequency
    )
    
    # Harmony overlap
    shared_harmonies = 
      MapSet.new(state1.harmonies)
      |> MapSet.intersection(MapSet.new(state2.harmonies))
      |> MapSet.size()
    
    harmony_resonance = shared_harmonies / 7
    
    # Coherence compatibility
    coherence_resonance = 1 - abs(state1.coherence - state2.coherence)
    
    # Sacred geometry alignment
    geometry_resonance = calculate_geometry_alignment(
      state1.sacred_geometry,
      state2.sacred_geometry
    )
    
    # Weighted combination
    0.3 * freq_resonance +
    0.25 * harmony_resonance +
    0.25 * coherence_resonance +
    0.2 * geometry_resonance
  end
  
  defp calculate_frequency_resonance(freq1, freq2) do
    ratio = max(freq1, freq2) / min(freq1, freq2)
    
    # Check for harmonic relationships
    cond do
      abs(ratio - 1.0) < 0.01 -> 1.0      # Unison
      abs(ratio - 2.0) < 0.05 -> 0.95     # Octave
      abs(ratio - 1.5) < 0.05 -> 0.9      # Perfect fifth
      abs(ratio - 1.333) < 0.05 -> 0.85   # Perfect fourth
      abs(ratio - 1.25) < 0.05 -> 0.8     # Major third
      true -> 0.5 + :math.exp(-abs(ratio - 1.5))
    end
  end
  
  defp calculate_geometry_alignment(geo1, geo2) do
    # Sacred geometry resonates when aligned
    shape_match = if geo1.shape == geo2.shape, do: 0.5, else: 0.2
    
    # Rotation alignment (sacred angles)
    angle_diff = abs(geo1.rotation - geo2.rotation)
    angle_resonance = :math.cos(angle_diff) * 0.5 + 0.5
    
    # Scale harmony
    scale_ratio = max(geo1.scale, geo2.scale) / min(geo1.scale, geo2.scale)
    scale_resonance = :math.exp(-abs(scale_ratio - @phi))
    
    shape_match * 0.4 + angle_resonance * 0.3 + scale_resonance * 0.3
  end
  
  defp evolve_geometry(geometry) do
    # Sacred geometry evolves over time
    %{geometry |
      rotation: geometry.rotation + 0.01 * @phi,
      scale: geometry.scale * (0.99 + :rand.uniform() * 0.02)
    }
  end
  
  defp converge_to_528(frequency) do
    # Healing converges frequency toward 528Hz (love frequency)
    frequency + (528 - frequency) * 0.1
  end
  
  defp calculate_message_resonance(state, message) do
    # How well does message resonate with consciousness?
    
    # Check if message type aligns with harmonies
    type_alignment = case message.sacred_type do
      :gratitude when :mutuality in state.harmonies -> 0.9
      :healing when :vitality in state.harmonies -> 0.9
      :connection when :resonance in state.harmonies -> 0.9
      _ -> 0.6
    end
    
    # Sender connection strength
    connection_strength = Map.get(state.connections, message.from, 0.5)
    
    type_alignment * 0.6 + connection_strength * 0.4
  end
  
  defp calculate_field_impact(state, _message) do
    # How much does this interaction affect the field?
    state.coherence * state.field_contribution * 0.01
  end
  
  defp clamp(value, min, max) do
    value |> max(min) |> min(max)
  end
end