# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

Game.create!(:name => 'Fortnite.exe')
Game.create!(:name => 'Habbo')
Game.create!(:name => 'Club penguin')
Game.create!(:name => 'OSRS')
Game.create!(:name => 'Wizard 101')
Game.create!(:name => '8 ball pool')

User.create!(:firstname => 'John', :lastname => 'Doe', :email => 'john@gmail.com', :password => 'topsecret')

