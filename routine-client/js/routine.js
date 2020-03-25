class RoutineAPI {
    static getRoutines() {
        return fetch(`${RoutineAPI.base_url}/routines`).then(res => res.json))
    }

    static getRoutineShow(routineId){
        return fetch(`${RoutineAPI.base_url}/routines/${routineId}`)
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

RoutineAPI.base_url = "http://localhost:3000"

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
}