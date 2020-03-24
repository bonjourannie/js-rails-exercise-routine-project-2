class RoutineSerializer
  include FastJsonapi::ObjectSerializer
  attributes :title
  has_many :exercises
end
