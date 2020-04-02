# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

exercise_a = Exercise.create(name: "plank", duration: "90 seconds", id: 1)
exercise_b = Exercise.create(name: "bicep curl", duration: "10 reps", id: 2)
exercise_c = Exercise.create(name: "forward fold", duration: "10 reps", id: 3)

routine_a = Routine.create(title: "leg day")
routine_b = Routine.create(title: "cool down")
routine_c = Routine.create(title: "upper body")