Rails.application.routes.draw do
  devise_for :users, :controllers => { :omniauth_callbacks => "users/omniauth_callbacks" }

  scope 'api'  do
    namespace :twitch do
      get ':username/chatters' => 'chatters#list'
    end
  end
  # match "api" => proc { [404, {}, ['Invalid API endpoint']] }
  # match "api/*path" => proc { [404, {}, ['Invalid API endpoint']] }

  get "/*path" => redirect("/?goto=%{path}")
  root "angular#index"
end
