class AngularController < ApplicationController
    def index
      render :index, formats: :html
    end

    def show
      render "angular/#{params[:path]}", layout: nil
    end
end
