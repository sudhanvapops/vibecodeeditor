### index.ts

### getPlaygroundBuyId( id )

- gets the plaground from the ID
- selects only title and contnet 

### Output 
{
    title: "React",
    content: {...}
}


### SaveUpdateCode()

- doing in templateFile collection

1. Params:
    - playgroundId
    - data: TemplateFolder


- checks for userLogin 
- using currentUser() in auth module 
- checks if the playground belongs to user 

- then update or create it 

upsert: update if exists, else create.

