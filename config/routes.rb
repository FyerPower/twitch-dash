Rails.application.routes.draw do
    scope 'api'  do
        namespace :twitch do
            get ':username/chatters' => 'chatters#list'
        end
    end

    get '*path' => redirect('/')
end
