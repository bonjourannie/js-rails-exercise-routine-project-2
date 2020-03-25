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
}