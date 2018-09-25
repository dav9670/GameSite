class Participant < ApplicationRecord
  belongs_to :opponent
  belongs_to :owner
  belongs_to :game
  belongs_to :winner
  belongs_to :waiting_for_user
end
