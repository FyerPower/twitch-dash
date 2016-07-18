Rails.application.routes.draw do
    constraints subdomain: 'api' do
        namespace :twitch do
            get ':username/chatters' => 'chatters#list'
        end
    end
end
