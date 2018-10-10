# For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
Rails.application.routes.draw do
  resources :games
  resources :participants
  devise_for :users

  resources :games
  
  root to: "games#index"
end
