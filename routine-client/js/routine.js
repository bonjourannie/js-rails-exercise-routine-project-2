class RoutineAPI {
    static getRoutines() {
        return fetch(`${RoutineAPI.base_url}/routines`).then(res => res.json)
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

let base_url = "http://localhost:3000"

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
                exercises.map(exerciseAttributes => Exercise.findOrCreateBy(trackAttributes))
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
      <p><a href="#/routines/${this.id}" class="routineShow ba1 pa2 bg-moon-gray link" data-routineid="${this.id}">Album Details</a></p>
        `
        return article.outerHTML
    }
}

Routine.all = []