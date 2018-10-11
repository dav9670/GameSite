# For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
Rails.application.routes.draw do
  devise_for :users

  resources :games
  resources :participants
  
  get '/user/:id/statistics', to: 'statistics#show', as: 'show_user_statistics'

  root to: "games#index"
end
