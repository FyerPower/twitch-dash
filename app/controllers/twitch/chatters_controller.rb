class Twitch::ChattersController < ApplicationController
    def list
        c = Curl::Easy.new("http://tmi.twitch.tv/group/user/"+params[:username].downcase+"/chatters")
        c.perform
        @chatters = JSON.parse(c.body_str)
    end
end
