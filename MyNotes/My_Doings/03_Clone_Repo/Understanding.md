### How Is Playground cretaing Usually

1. createPlayground()
just cretaes playground

when the created playground is clicked 
it will take you to link
"/playground/${project.id}"


2. Main Things Happen Here "/playground/${project.id}"
- usePlayground() hook key component
- loadPlaygroundData() loads the data from db to playground

- if its the first time
- it makes an api call to /api/template/${id}

- so first now it checks if it is valid template data
- if yes
    then in library it holds the path to the starter template
    from there it uses saveTemplateStructureToJson()
    and read from it

So my plan will be now to 
clone the repo into a folder 
from there use above to make a json and send it to usePlayground

1. Clone repo on backend
2. Convert folder → JSON
3. Return JSON from /api/template/{id}
4. Make a Server action to do all of the above