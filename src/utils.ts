export const logErrors = (message: string, errors: any[]) => {
    console.groupCollapsed && console.groupCollapsed(message)
    errors.forEach(error => console.error(error))
    console.groupEnd && console.groupEnd()
}
