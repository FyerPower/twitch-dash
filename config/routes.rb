Rails.application.routes.draw do
    namespace :api  do
        namespace :twitch do
            get ':username/chatters' => 'chatters#list'
        end
    end
end
