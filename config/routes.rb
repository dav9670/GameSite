# For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
Rails.application.routes.draw do
  devise_for :users

  root to: "games#index"

  # Games
  get '/games', to: 'games#index', as: 'games'

  # Participants
  get '/games/:game_id/participants', to: 'participants#index', as: 'participants'
  get '/games/:game_id/participants/:participant_id', to: 'participants#show', as: 'show_participant'
  post '/games/:game_id/participants', to: 'participants#create', as: 'create_participant'
  put '/games/:game_id/participants/:participant_id', to: 'participants#update', as: 'update_participant'
  delete '/participants/:id', to: 'participants#destroy', as: 'destroy_participant'
  
  # Relationships
  get '/users/relationships', to: 'relationships#index', as: 'relationships'
  get '/users/relationships/new', to: 'relationships#new', as: 'new_relationship'
  post '/users/relationships', to: 'relationships#create', as: 'create_relationship'
  put '/users/relationships/:id', to: 'relationships#update', as: 'update_relationship'
  delete '/users/relationships/:id', to: 'relationships#destroy', as: 'destroy_relationship'


  # Statistics
  get '/users/:id/statistics', to: 'statistics#show', as: 'show_statistics'

end
