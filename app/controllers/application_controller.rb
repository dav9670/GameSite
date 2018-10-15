class ApplicationController < ActionController::Base
    before_action :configure_permitted_parameters, if: :devise_controller?
    before_action :authenticate_user!

    def check_playing_game
        if(user_signed_in?)
            if(current_user.is_ingame?)
                participant = current_user.current_participant
                path = show_participant_path(participant.game, participant)
                if(request.path != path)
                    redirect_to path
                end
            end
        end
    end

    protected
        def configure_permitted_parameters
            devise_parameter_sanitizer.permit(:sign_up, keys: [:firstname, :lastname])
            devise_parameter_sanitizer.permit(:account_update, keys: [:firstname, :lastname])
        end
end
