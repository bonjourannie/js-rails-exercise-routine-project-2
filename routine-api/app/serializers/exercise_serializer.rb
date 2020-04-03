class ExerciseSerializer
  include FastJsonapi::ObjectSerializer
  attributes :name, :duration, :routine_id
  belongs_to :routine
end
