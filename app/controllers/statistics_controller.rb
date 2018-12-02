class StatisticsController < ApplicationController
    def show
    end

    def get_name
        user = User.find(params[:id])
        respond_to do |format|
            format.html
            format.json { render json: user.name }
        end
    end
end
