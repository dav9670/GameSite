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
User.create!(:firstname => 'Dav', :lastname => 'Laf', :email => 'dav@gmail.com', :password => 'topsecret')

Relationship.create!(:user => User.all[0], :friend => User.all[1], :status => "accepted")

Participant.create!(:owner => User.all[0], :opponent => User.all[1], :waiting_for_user => User.all[0], :game => Game.all[0], :winner => User.all[0])
Participant.create!(:owner => User.all[1], :opponent => User.all[0], :waiting_for_user => User.all[1], :game => Game.all[0], :winner => User.all[1])
Participant.create!(:owner => User.all[1], :opponent => User.all[0], :waiting_for_user => User.all[0], :game => Game.all[1], :winner => User.all[1])
Participant.create!(:owner => User.all[0], :opponent => User.all[1], :waiting_for_user => User.all[0], :game => Game.all[0], :winner => User.all[0])
Participant.create!(:owner => User.all[0], :opponent => User.all[1], :waiting_for_user => User.all[1], :game => Game.all[1], :winner => User.all[1])
