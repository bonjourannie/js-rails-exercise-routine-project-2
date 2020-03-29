let base_url = "http://localhost:3000"

class RoutineAPI {
    static getRoutines() {
        return fetch(`${base_url}/routines`).then(res => res.json)
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
                    exercises: included.map(({id, attributes: {name, duration}}) => {
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
        return fetch(`${RoutineAPI.base_url}/routines`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(routineAttributes)
        })
          .then(res => res.json())
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

    save () {
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

    exercies(){
        return Exercise.all.filter(exercise => exercise.routine_id == this.id)
    }

    renderCard(){
        let article = document.createElement('article')
        article.className = "fl w-100 w-50-m  w-25-ns pa2-ns"
        article.dataset['routine_id'] = this.id 
        article.innerHTML = `
        <div class="aspect-ratio aspect-ratio--1x1">
        class="db bg-center cover aspect-ratio--object" />
      </div>
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
        <h1>Workout RoutinesPage</h1>
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

    renderExerciseList(){
        //iterate over exercises & add a list item to the ul for each one using appendChild
        let ul = document.createElement('ul')
        ul.id = "exerciseList"
        this.routine.exercises().forEach(exercise => {
            ul.insertAdjacentElement('beforeend', exercise.render())
        })
        return ul.outerHTML
    }

    render(){
        return `
        <div class="ph2 ph0-ns pb3 link db">
          <h3 class="f5 f4-ns mb0 black-90">${this.routine.title}</h3>
        </div>
        ${this.renderExerciseList()}
        `
    }

    
}

// Event Listeners 
document.addEventListener('DOMContentLoaded', () => {
    let root = document.getElementById('root')
    root.innerHTML = loadingGif()
    Routine.getAll().then(routine => {
        root.innerHTML = new RoutinesPage(routines).render()
    })
    document.addEventListener('click', (e) => {
        if(e.target.matches('.routineShow')) {
            let routine = Routine.findById(e.target.data.routineId)
            routine.getRoutineDetails().then(routine => {
                root.innerHTML = new RoutinesShowPage(routine).render()
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
            e.target.querySelectorAll('input[type="text]').forEach(input => formData[input.id] = input.value)
            Routine.create(formData)
                .then(routine => {
                    document.querySelector('#routines').insertAdjacentHTML('beforeend', routine.renderCard())
                })
        }
    })
})

const loadingGif = () => {
    let loading = document.createElement('img')
    loading.src = 'https://i.giphy.com/media/y1ZBcOGOOtlpC/giphy.webp'
    return loading.outerHTML
}
