class Game < ApplicationRecord
    has_many :participants

    def to_s
        name
    end
    
    def joinable_participants_for_user(user)
        participants.where(["owner_id != ? AND opponent_id IS NULL and status NOT LIKE \"ended\"", user])
    end
end
