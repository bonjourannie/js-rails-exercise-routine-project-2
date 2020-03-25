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
    
}