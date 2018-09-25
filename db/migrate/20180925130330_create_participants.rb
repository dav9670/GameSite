class CreateParticipants < ActiveRecord::Migration[5.2]
  def change
    create_table :participants do |t|
      t.references :opponent
      t.references :owner
      t.references :game, foreign_key: true
      t.references :winner
      t.references :waiting_for_user
      t.string :status
      t.text :game_data

      t.timestamps
    end
    add_foreign_key :participants, :users, column: :opponent_id
    add_foreign_key :participants, :users, column: :owner_id
    add_foreign_key :participants, :users, column: :winner_id
    add_foreign_key :participants, :users, column: :waiting_for_user_id
  end
end
