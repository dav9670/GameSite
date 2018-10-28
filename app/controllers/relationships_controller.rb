class RelationshipsController < ApplicationController
  before_action :set_relationship, only: [:update, :destroy]

  # GET /relationships
  # GET /relationships.json
  def index
    @relationships = current_user.friends
  end

  # GET /relationships/new
  def new
    @relationship = Relationship.new
    name = params[:name]
    if(name != nil)
      @users = User.where("id != #{current_user.id} AND email LIKE \"%#{name}%\"")
                    .where.not(id: current_user.user_relationships.select(:friend_id))
                    .where.not(id: current_user.friend_relationships.select(:user_id))
    end
  end

  # POST /relationships
  # POST /relationships.json
  def create
    @relationship = Relationship.new(relationship_params.merge({:user => current_user, :status => "waiting"}))

    respond_to do |format|
      if @relationship.save
        format.html { redirect_to relationships_path, notice: 'Relationship was successfully created.' }
        format.json { render :show, status: :created, location: @relationship }
      else
        format.html { render :new }
        format.json { render json: @relationship.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /relationships/1
  # PATCH/PUT /relationships/1.json
  def update
    respond_to do |format|
      if @relationship.update(relationship_params)
        format.html { redirect_to relationships_path, notice: 'Relationship was successfully updated.' }
        format.json { render :show, status: :ok, location: @relationship }
      else
        format.html { render :edit }
        format.json { render json: @relationship.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /relationships/1
  # DELETE /relationships/1.json
  def destroy
    @relationship.destroy
    respond_to do |format|
      format.html { redirect_to relationships_path, notice: 'Relationship was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_relationship
      @relationship = Relationship.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def relationship_params
      params.require(:relationship).permit(:user_id, :friend_id, :status)
    end
end
