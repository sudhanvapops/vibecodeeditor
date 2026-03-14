interface Details {
    name: string
    age: number
}

const myMap = new Map<string,Details>();

myMap.set("1",{
    "name":"Sudhanva",
    "age": 20
})

myMap.set("2",{
    "name":"Akash",
    "age": 20
})

const myObj = Object.fromEntries(myMap)
const serilized = JSON.stringify(myObj)

console.log(myMap)
console.log(myObj)
console.log(serilized)