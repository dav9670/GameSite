# For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
Rails.application.routes.draw do
  devise_for :users

  resources :games
  resources :participants
  
  get '/users/relationships', to: 'relationships#index', as: 'relationships'
  get '/users/relationships/new', to: 'relationships#new', as: 'new_relationship'
  post '/users/relationships', to: 'relationships#create', as: 'create_relationship'
  put '/users/relationships/:id', to: 'relationships#update', as: 'update_relationship'
  delete '/users/relationships/:id', to: 'relationships#destroy', as: 'destroy_relationship'

  get '/users/:id/statistics', to: 'statistics#show', as: 'show_statistics'

  root to: "games#index"
end
