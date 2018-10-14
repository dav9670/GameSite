json.extract! participant, :id, :opponent_id, :owner_id, :game_id, :winner_id, :waiting_for_user_id, :status, :game_data, :created_at, :updated_at
json.url participant_url(participant, format: :json)
