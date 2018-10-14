require "application_system_test_case"

class ParticipantsTest < ApplicationSystemTestCase
  setup do
    @participant = participants(:one)
  end

  test "visiting the index" do
    visit participants_url
    assert_selector "h1", text: "Participants"
  end

  test "creating a Participant" do
    visit participants_url
    click_on "New Participant"

    fill_in "Game Data", with: @participant.game_data
    fill_in "Game", with: @participant.game_id
    fill_in "Opponent", with: @participant.opponent_id
    fill_in "Owner", with: @participant.owner_id
    fill_in "Status", with: @participant.status
    fill_in "Waiting For User", with: @participant.waiting_for_user_id
    fill_in "Winner", with: @participant.winner_id
    click_on "Create Participant"

    assert_text "Participant was successfully created"
    click_on "Back"
  end

  test "updating a Participant" do
    visit participants_url
    click_on "Edit", match: :first

    fill_in "Game Data", with: @participant.game_data
    fill_in "Game", with: @participant.game_id
    fill_in "Opponent", with: @participant.opponent_id
    fill_in "Owner", with: @participant.owner_id
    fill_in "Status", with: @participant.status
    fill_in "Waiting For User", with: @participant.waiting_for_user_id
    fill_in "Winner", with: @participant.winner_id
    click_on "Update Participant"

    assert_text "Participant was successfully updated"
    click_on "Back"
  end

  test "destroying a Participant" do
    visit participants_url
    page.accept_confirm do
      click_on "Destroy", match: :first
    end

    assert_text "Participant was successfully destroyed"
  end
end
