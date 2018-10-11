class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable
  has_many :relationships
  has_many :hosted_games, :class_name => 'Participant', :foreign_key => "owner" 
  has_many :joined_games, :class_name => 'Participant', :foreign_key => "opponent"
  
  def participated_games
    hosted_games.or(joined_games)
  end

  def participants_for_game(game_id)
    participated_games.where(["game_id = ?", game_id])
  end

  def winned_games(game_id)
    participants_for_game(game_id).where(["winner_id = ?", id])
  end

  def total_wins
    participated_games.where(["winner_id = ?", id]).count
  end

  def lost_games(game_id)
    participants_for_game(game_id).where(["winner_id != ?", id])
  end

  def total_losses
    participated_games.where(["winner_id != ?", id]).count
  end
end
