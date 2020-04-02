class RemoveRoutineIdFromRoutine < ActiveRecord::Migration[6.0]
  def change

    remove_column :routines, :routine_id, :integer
  end
end
