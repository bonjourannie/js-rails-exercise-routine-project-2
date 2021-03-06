let base_url = "http://192.168.56.101:3000"

class RoutineAPI {
    static getRoutines() {
        return fetch(`${base_url}/routines`).then(res => res.json())
    }

    static getRoutineShow(routineId){
        return fetch(`${base_url}/routines/${routineId}`)
            .then(res => res.json())
            .then(json => {
                const {
                    data: {
                        id,
                        attributes: {
                            title
                        }
                    },
                    included
                } = json 
                return {
                    id, 
                    title,
                    exercises: included.map(({id, attributes: {name, duration, routine_id}}) => {
                        return {
                            id, 
                            name, 
                            duration,
                            routine_id
                        }
                    })
                }
            })
    }
    static createRoutine(routineAttributes) {
        return fetch(`${base_url}/routines`, {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(routineAttributes)
        })
          .then(res => res.json())
    }

    static createExercise(exerciseAttributes) {
        return fetch(`${base_url}/exercises`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(exerciseAttributes)
        }).then(res => res.json())
    }
    
}



class Routine {
    constructor({id, title}) {
        this.id = id
        this.title = title
    }

    static getAll(){
        if (Routine.all.length === 0) {
            return RoutineAPI.getRoutines().then(routines => {
                Routine.all = routines.map(routineAttributes =>
                    new Routine(routineAttributes)
                )
                return Routine.all 
            })
        } else {
            return Promise.resolve(Routine.all)
        }
    }

    static findById(id){
        return Routine.all.find(routine => routine.id == id)
    }

    static create(routineAttributes) {
        return RoutineAPI.createRoutine(routineAttributes)
        .then(routineJSON => {
            return new Routine(routineJSON).save()
        })
    }

    save() {
        Routine.all.push(this)
        return this
    }

    getRoutineDetails(){
        if(this.exercises().length === 0) {
            return RoutineAPI.getRoutineShow(this.id)
                .then(({exercises}) => {
                    exercises.map(exerciseAttributes => Exercise.findOrCreateBy(exerciseAttributes))
                    return this
                })
        } else {
            return Promise.resolve(this)
        }

    }

    exercises(){
        return Exercise.all.filter(exercise => exercise.routine_id == this.id)
    }

    renderCard(){
        let article = document.createElement('article')
        article.className = "fl w-100 w-50-m  w-25-ns pa2-ns"
        article.dataset['id'] = this.id 
        article.innerHTML = `  
        <a href="#0" class="ph2 ph0-ns pb3 link db">
            <h3 class="f5 f4-ns mb0 black-90">${this.title}</h3>
        </a>
        <p><a href="#/routines/${this.id}" class="routineShow ba1 pa2 bg-moon-gray link" data-routineid="${this.id}">Routine Details</a></p>
        `
        return article.outerHTML
    }

}

Routine.all = []

class Exercise {
    constructor ({id, name, duration, routine_id}) {
        this.id = id 
        this.name = name 
        this.duration = duration
        this.routine_id = routine_id 
    }

    static findOrCreateBy(attributes) {
        let found = Exercise.all.find(exercise => exercise.id == attributes.id)
        return found ? found : new Exercise(attributes).save()
    }

    static create(exerciseAttributes){
        return RoutineAPI.createExercise(exerciseAttributes)
            .then(exerciseJSON => {
            return new Exercise(exerciseJSON).save()
        })
    }

    renderExerciseCard(){
        let article = document.createElement('article')
        article.className = "fl w-100 w-50-m  w-25-ns pa2-ns"
        article.dataset['routineid'] = this.routine_id 
        article.innerHTML = `  
        <a href="#0" class="ph2 ph0-ns pb3 link db">
            <p class="f5 f4-ns mb0 black-90">${this.name}</p>
        </a>
        `
        return article.outerHTML
    }

    routine() {
        return Routine.findById(this.routineId)
    }

    save(){
        Exercise.all.push(this)
        return this
    }

    render() {
        return `
        <li>${this.name}</li>
      `
    }

    

}

Exercise.all = []

class RoutinesPage {
    constructor(routines){
        this.routines = routines
    }    

    renderForm() {
        return `
          <form class="addRoutine">
            <h3>Add Routine</h3>
            <p>
              <label class="db">Title</label>
              <input type="text" name="title" id="title" />
            </p>
            <input type="submit" value="Add Routine" />
          </form>
        `
    }

    renderList(){
        return this.routines.map(routine => {
            return routine.renderCard()
        }).join('')
    }

    render() {
        return `
        <h1>Workout Routines Page</h1>
        ${this.renderForm()}
        <section id="routines">
            ${this.renderList()}
        </section>
        `
    }

}

class RoutineShowPage {
    constructor(routine) {
        this.routine = routine
    }

    //iterate over exercises & add a list item to the ul for each one using appendChild        
    renderExerciseList(){
        let ul = document.createElement('ul')
        ul.id = "exerciseList"
        this.routine.exercises().forEach(exercise => {
            ul.insertAdjacentHTML('beforeend', exercise.render())
        })
        return ul.outerHTML
    }

    addExercise() {
        return `
            <form class="addExercise">
            <input type="text" style="display:none" id="routine_id" value="${this.routine.id}">
                <h3>Add Exercise</h3>
                <p>
                    <label class="db">Exercise Name</label>
                    <input type="text" name="name" id="name" />
                </p>
                <input type="submit" value="Add Exercise" />
            </form>
        `
    }

    render(){
        return `
        <div class="ph2 ph0-ns pb3 link db">
          <h3 class="f5 f4-ns mb0 black-90">${this.routine.title}</h3>
        </div>
        ${this.renderExerciseList()}
        ${this.addExercise()}
        `
    }

}

// Event Listeners 
document.addEventListener('DOMContentLoaded', () => {
    let root = document.getElementById('root')
    root.innerHTML = loadingGif()
    Routine.getAll().then(routines => {
        root.innerHTML = new RoutinesPage(routines).render()
    })
    document.addEventListener('click', (e) => {
        if(e.target.matches('.routineShow')) {
            let routine = Routine.findById(e.target.dataset.routineid)
            routine.getRoutineDetails().then(routine => {
                root.innerHTML = new RoutineShowPage(routine).render()
            })
        }
        if (e.target.matches('.routineIndex')) {
            root.innerHTML = new RoutinesPage(Routine.all).render()
        }
    })
    document.addEventListener('submit', (e) => {
        e.preventDefault()
        if(e.target.matches('.addRoutine')) {
            let formData = {}
            e.target.querySelectorAll('input[type="text"]').forEach(input => formData[input.id] = input.value)
            
            Routine.create({routine:formData})
                .then(routine => {
                    document.querySelector('#routines').insertAdjacentHTML('beforeend', routine.renderCard())
                })
        }
        if (e.target.matches('.addExercise')) {
            let formData = {}
            e.target.querySelectorAll('input[type="text"]').forEach(input => formData[input.id] = input.value)
            //debugger
            Exercise.create({exercise:formData})
                .then(exercise => {
                    document.querySelector('#exerciseList').insertAdjacentHTML('beforeend', exercise.render())
                })
            
        }
    })
    

})

const loadingGif = () => {
    let loading = document.createElement('img')
    loading.src = 'https://i.giphy.com/media/y1ZBcOGOOtlpC/giphy.webp'
    return loading.outerHTML
}
