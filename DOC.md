### RoutineAPI 
- static getRoutines() - return promise for all Routines in DB 
- static getRoutineShow(routineId) - return promise for routine and all its related exercises from DB 
- static createRoutine(routineAttributes) - return promise for routine we just created 

### Routine 
- static getAll() - return promise for array of all Routine objects (with API call if needed) 
- static findById(id) - return routine instance (from Routine.all) that matches the given id 
- static create(attributes) - submit API call, use response to create a new Routine instance, add it to Routine.all and return a promise for the instance. 
- save() - adds an routine instance to Routine.all and returns it 
- getRoutineDetails() - returns promise for routine and exercise details (with API call if needed) 
- exercises() - returns array of Exercise instances related to this routine (from Exercise.all) 
- renderCard() - returns string of html for rendering a single routine (grid view) 

### Exercise 
- static findOrCreateBy(attributes) - returns an existing exercise instance (matched by id) or creates a new one and returns it 
- save() - adds an exercise instance to Exercise.all and returns it 
- render() - returns string of html for displaying exercise in list view (on RoutineShowpage) 

### RoutinesPage 
- renderForm() - returns html for new Routine form 
- renderList() - returns html for routine grid 
- render() - returns html for both the form and the routine grid 

### RoutineShowPage 
- renderExerciseList() - returns html string for the ul containing all the exercises 
- render() - returns html for routine show page in entirety. 

### Event Listeners 
- click 
- .routineShow - replaces root node's innerHTML with RoutineShow page for routine (found via data-attribute for routineId)  
- .routinesIndex - replaces root node's innerHTML with RoutinesPage(Routine.all)
- submit 
- .addRoutine - calls the Routine.create() method and passes in form data, consumes the returned promise (a routine instance), calls renderCard() on it and does an insertAdjacentHTML to add the card to the routine grid.