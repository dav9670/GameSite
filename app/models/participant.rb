class Participant < ApplicationRecord
  belongs_to :opponent, class_name: "User"
  belongs_to :owner, class_name: "User"
  belongs_to :game
  belongs_to :winner, class_name: "User"
  belongs_to :waiting_for_user, class_name: "User"
end
