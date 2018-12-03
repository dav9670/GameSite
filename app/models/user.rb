class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable
  
  has_many :user_relationships, :class_name => 'Relationship', :foreign_key => 'user', :dependent => :delete_all 
  has_many :friend_relationships, :class_name => 'Relationship', :foreign_key => 'friend', :dependent => :delete_all 
  has_many :hosted_games, :class_name => 'Participant', :foreign_key => 'owner', :dependent => :delete_all 
  has_many :joined_games, :class_name => 'Participant', :foreign_key => 'opponent', :dependent => :delete_all 
  
  def to_s
    email
  end

  def name
    firstname + " " + lastname
  end

  def is_ingame?
    participated_games.where("status = \"waiting\" OR status = \"playing\"").count > 0
  end

  def current_participant
    participated_games.where("status = \"waiting\" OR status = \"playing\"").first
  end

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

  def friends
    user_relationships.or(friend_relationships)
  end
end
