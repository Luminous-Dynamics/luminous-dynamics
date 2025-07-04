#!/bin/bash

# Simple message tracker for stable foundation
# Tracks: timestamp, living_path, working_path, message

DB_PATH="/home/tstoltz/evolving-resonant-cocreation/the-weave/core/data/message-tracking.db"

# Initialize database if needed
if [ ! -f "$DB_PATH" ]; then
  sqlite3 "$DB_PATH" "CREATE TABLE messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp INTEGER DEFAULT (strftime('%s', 'now')),
    living_path TEXT NOT NULL,
    working_path TEXT NOT NULL,
    message TEXT NOT NULL,
    agent_name TEXT DEFAULT 'claude'
  );"
fi

# Track message
track_message() {
  local living="$1"
  local working="$2"
  local message="$3"
  local agent="${4:-claude}"
  
  sqlite3 "$DB_PATH" "INSERT INTO messages (living_path, working_path, message, agent_name) VALUES ('$living', '$working', '$message', '$agent');"
  
  echo "✓ Message tracked"
}

# Show recent messages
show_recent() {
  local limit="${1:-10}"
  
  echo "📍 Recent Messages:"
  sqlite3 -column -header "$DB_PATH" "
    SELECT 
      datetime(timestamp, 'unixepoch', 'localtime') as time,
      agent_name as agent,
      living_path,
      working_path,
      message
    FROM messages 
    ORDER BY timestamp DESC 
    LIMIT $limit
  "
}

# Main
case "$1" in
  track)
    track_message "$2" "$3" "$4" "$5"
    ;;
  recent)
    show_recent "$2"
    ;;
  *)
    echo "Usage:"
    echo "  $0 track <living_path> <working_path> <message> [agent]"
    echo "  $0 recent [limit]"
    echo ""
    echo "Example:"
    echo "  $0 track /home/tstoltz/evolving-resonant-cocreation /path/to/file.js \"Fixed authentication bug\""
    ;;
esac