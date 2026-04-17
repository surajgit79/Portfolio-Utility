import { timeStamp } from "console"

export const getDate = (timestamp: string) => {
    const d = new Date(timestamp)
    return d.toLocaleDateString()
}

export const getYear = (timestamp: string) => {
    const d = new Date(timestamp)
    return d.getFullYear()
}

export const getMonth = (timestamp: string) => {
    const d = new Date(timestamp)
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    return months[d.getMonth()]
}

export const getDay = (timeStamp: string) => {
    const d = new Date(timeStamp)
    return d.getUTCDate()
}

export const getMY = (timestamp: string) => {
    return `${getMonth(timestamp)}, ${getYear(timestamp)}`
}

export const getDOB = (timestamp: string) => {
    return `${getMonth(timestamp)} ${getDay(timestamp)}, ${getYear(timestamp)}`
}