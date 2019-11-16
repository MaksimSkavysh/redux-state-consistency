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
