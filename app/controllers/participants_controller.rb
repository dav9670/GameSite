class ParticipantsController < ApplicationController
  before_action :set_participant, only: [:destroy]

  # GET /participants
  # GET /participants.json
  def index
    @game = Game.find(params[:game_id])
    @participants = @game.joinable_participants_for_user(current_user)
  end

  # GET /participants/1
  # GET /participants/1.json
  def show
    @game = Game.find(params[:game_id])
    @participant = Participant.find(params[:participant_id])
  end

  # POST /participants
  # POST /participants.json
  def create
    @game = Game.find(params[:game_id])
    @participant = Participant.new(participant_params)

    respond_to do |format|
      if @participant.save
        format.html { redirect_to show_participant_path(@game, @participant) }
      else
        format.html { render :new }
      end
    end
  end

  # PATCH/PUT /participants/1
  # PATCH/PUT /participants/1.json
  def update
    game = Game.find(params[:game_id])
    participant = Participant.find(params[:participant_id])
    respond_to do |format|
      if participant.update(participant_params)
        format.html { redirect_to show_participant_path(game, participant) }
      else
        format.html { render :edit }
      end
    end
  end

  # DELETE /participants/1
  # DELETE /participants/1.json
  def destroy
    @participant.destroy
    respond_to do |format|
      format.html { redirect_to root_path, notice: 'Participant was successfully destroyed.' }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_participant
      @participant = Participant.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def participant_params
      params.require(:participant).permit(:opponent_id, :owner_id, :game_id, :winner_id, :waiting_for_user_id, :status, :game_data)
    end
end
