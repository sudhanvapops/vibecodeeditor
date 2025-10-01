### Index.ts

All the required actions are there here 
- toggleStarMarked
- getAllPlayground
- createPlayground
- deletePlayground
- etc...

#### getAllPlaygroundForUser()

- gets all the playground related to that user
- where it searches by the user id 
- includes user

All Play Ground [
  {
    id: 'x',
    title: 'ds',
    description: 'Fast, lightweight, built on Web Standards. Support for any JavaScript runtime.',
    template: 'HONO',
    createdAt: 2025-10-01T06:13:24.271Z,
    updatedAt: 2025-10-01T06:13:24.271Z,
    userId: 'xyz',
    <!-- Full user is included -->
    user: {
      id: 'xyz',
      name: 'Sudhanva',
      email: 'sudhanvapops@gmail.com',
      image: 'https://avatars.githubusercontent.com/u/88150042?v=4',
      role: 'USER',
      createdAt: 2025-09-11T13:55:23.457Z,
      updatedAt: 2025-09-11T13:55:23.457Z
    },

    starMark: []
  },
  {
    same
  }
]

