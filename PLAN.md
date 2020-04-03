## Class responsibilities 

### RoutineAPI 
- static getRoutines() 
- static getRoutineShow(routineId) 
- This class is used for communicating with our API and formatting the responses in such a way that we can easily create instances of our ViewModel classes (Routine & Exercise). 

###Routine 
- static getAll() 
- static findById(id) 
- getRoutineDetails() 
- exercises() 
- renderCard() 
- This class is a view model for Routines. It will store all of the attributes I need to display a routine in the two different contexts in which it will appear. I'll have separate methods for displaying a routine on the show page, vs the grid page. 
- I'll also persist Routines using a save() method so that I don't have to fetch the same routine from the database multiple times. 
- Routine could also have a static findOrCreateBy method (maybe?) 
- Because I'm saving Routines, I'll also have static methods that we can use to find stored routines. (This will be useful to if I want see the show page for a routine, I can click on a link that has a data attribute pointing to the Routine's id, and can use that id to find the existing routine, to get the markup for the show page for that routine.) 
- Routine will have a getExercises() method that will get the exercises for this routine (if necessary) 
- Routine will have an exercises() method that will look through Exercise.all to find all of the exercises that match that routine's id. 

##Exercise 
- static findOrCreateBy(attributes) 
- save() 
- render() 
- This class is a view model for Exercises. It will store all of the attributes we need to display a exercise on the routine show page. We could have a exercises index, which might have a different view (this would want to include the routine as well) 
- Exercise will have a save() method to handle persistence and have a findOrCreateBy method that make sure we don't add the same exercise more than once. 

## RoutinesPage 
- renderForm() 
- renderList() 
- render() 
- This class renders the home page of our app, it needs routines to do so, and receives them as an argument in the constructor. 

## RoutineShowPage 
- renderExerciseList() 
- render() 
- This class renders the routine show page of our app, it needs a routine (that has exercises) to do so, it receives the routine as an argument in the constructor. 

## Event Listeners 
- Decide which instances are necessary at different moments in our workflow and handle actually doing DOM manipulations. 
- Have click, submit, and change event listeners and handle them each appropriately by checking what kind of element we targeted with the event (using a css selector that we match with the e.target.matches('.css-selector') technique) 

## UIState 
RoutineAPI

## Page Templates (and Partials) 
- RoutinesPage (list of routines and form to add new one) 
- RoutineShowPage (with exercise list and form to add new exerercise) BONUS: RoutineSearch?

## Partials 
RoutineForm ExerciseForm RoutineList ExerciseList

## Models 
- Routine 
- Exercise

## User Actions 
- User adds a Routine by submitting RoutineForm 
- User adds an exercise to a routine by submitting ExerciseForm 
- User clicks on a Routine to visit the RoutineShowPage for the routine 
- BONUS: User searches for a routine by submitting RoutineSearch?

## App Summary 
app will have two main views.

- The Routine Index (with a form to add a new routine on it and a list of all the routines) - The Routine Show page (with a form to add a new exercise to the routine and a list of all the current exercises) 

Navigation will be simple. There will be a link at the top of our html to take us back to the Routine Index. Each Routine in the list will have a link to the Routine Show page where we can see a form to add an exercise to the routine and a full list of the current exercises. The way we'll handle links will be to add an event listener to the document to prevent default behavior and then use classes to handle what should happen when we click different kinds of links (one class will indicate how we should handle going back to routines index vs another will tell us how to respond when it's a link to a routine show page)

## API Interactions 
To support our App, we'll need 4 API endpoints.
```
get '/routines', to: 'routines#index' 
get '/routines/:id', to: 'routines#show' 
post '/routines', to: 'routines#create' 
post '/routines/:id/exercises', to: 'exercises#create' 
```
We'll have a RoutineAPI class that knows how to make requests to these endpoints and return the response in JSON format. 
- The `get '/routines'` endpoint will return an index of the routines without the exercises included. 
- The `get '/routines/:id` endpoint will include routine details in addition to the routine's exercises (has_many requirement). 
- The `post '/routines'` endpoint will allow us to create a routine and add it to our database 
- The post `'/routines/:id/exercises'` endpoint will allow to add an exercise to an existing exercise.

### Storing information (state) in our program. 
When we make requests to our API, we'll use the responses to create instances of our Routine and Exercise classes and store them in memory (within JS variables). We'll do this

Equivalent of class variables in Ruby in Javascript
```
#ruby 
class Routine 
    attr_reader :title 
    @@all = [] 
    def initialize(attrs) 
        @title = attrs["title"] 
    end

def self.all 
    @@all 
end

def self.find_by_title(title) 
    self.all.find{|routine| routine.title == title} 
    end 
end

Routine.all.map {|routine| routine.title } 
```

```
// js 
class Routine { 
    constructor(attrs) { 
        this.title = attrs.title 
    }

    static findByTitle(title) { 
        return Routine.all.find(routine => routine.title === title) 
    } 
}

Routine.all = []

Routine.all.map(routine => routine.title)
```

PLAN 
- Add serializers for Routines and Exercises 
- Configure /routines/:id to use exercises serializer 
- Configure rack-cors gem to allow for our front end to connect to the Rails API 
- Add RoutineAPI class that can make a request to our API and return JSON formatted data. 
- Add an all class variable to the Routine and a getAll() static method that makes a request to our API returns a promise to return an array of routine instances. 
- Add logic to our RoutinesPage class to render the list of routines. We also adjusted that class to take routines as a parameter in the constructor. 
- Add to the DOMContentLoaded event handler in index.js to get the Routines using Routine.getAll() and then passed the routines to RoutinesPage and rendered it to the root node. 
- Add Serializers for Routines to handle the index and show endpoints.

## RUN 
- rails g serializer Routine 
- title rails g serializer Exercise name duration routine_id 

## In RoutinesController show action
```
GET /routines/1
def show 
    options = {} 
    options[:include] = [:exercises, :'exercises.name', :'exercises.duration'] render json: RoutineSerializer.new(@routine, options) 
end
``` 
To get our API to work we'll also need to add the rack-cors gem and add the configuration in config/initializers/cors.rb
```
bundle add rack-cors 
```
```
Rails.application.config.middleware.insert_before 0, Rack::Cors do 
allow do 
    origins 'http://localhost:8000'

    resource '*',
        headers: :any,
        methods: [:get, :post, :put, :patch, :delete, :options, :head]
    end 
end 
```
We're going to run our frontend server using the following command: 
```python -m SimpleHTTPServer ```
This starts a local server on port 8000.

We then have to add a RoutineAPI class that can hit the routines index route, get the results and store them in Routine.all
```
class RoutineAPI { 
    static fetchRoutines() { 
        return fetch(http://localhost:3000/routines) 
            .then(res => res.json()) 
    } 
} 
```
``` 
class Routine { 
    constructor({id, title}) { 
            this.id = id 
            this.title = title 
        }

    static getAll() { 
        if(Routine.all.length === 0) { 
            return RoutineAPI.fetchRoutines().then(json => { 
                Routine.all = json.map(routineAttributes => new Routine(routineAttributes))
                return Routine.all 
            }) 
        } else { 
            return Promise.resolve(Routine.all) 
        } 
    }
    
    renderCard() { 
        let article = document.createElement('article') 
        article.className = "fl w-100 w-50-m w-25-ns pa2-ns h6-ns" 
        article.dataset['id'] = routine.id 
        article.innerHTML = 
            <a href="#0" class="ph2 ph0-ns link db"> 
            <h3 class="f5 f4-ns h2-ns mb0 black-90">${this.title}</h3> 
            </a> 
            <p><button class="editRoutine" data-id="${routine.id}">Edit Routine</button></p> 
            return article
    } 
}
```
Routine.all = []
```