export class stateConsistencyError extends Error{
    private errors: any[]

    constructor(props: { message: string, errors: any[], [key:string]: any }) {
        super(props.message)
        this.errors = props.errors
    }

    toString () {
        return `State consistency error: ${this.message}`
    }
}

export const logErrors = (message: string, errors: any[]) => {
    console.groupCollapsed && console.groupCollapsed(message)
    errors.forEach(error => console.error(error))
    console.groupEnd && console.groupEnd()
}
