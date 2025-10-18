# SBA-319

This is a small Node, Express, Mongoose server application that mimics the admin landing page for anime reviews. At the index of the API, it is assumed that the client is an administrator to avoid using custom api keys via query strings or headers and fully showcase all the functionalities of this application.

## Dependencies

Below is a list of dependencies for the project and a brief explanation of their purposes.

- `express` is used as the server and handles client requests with routes.
- `mongoose` is used to access the anime_reviews database and its collections in MongoDB.
- `mongoose-sequence` is used to handle an auto incrementing field (_id field in the anime collection). It also creates another collection called counter. For user and development conveniences, the _id in anime should be predictable.
- `method-override` is used to allow forms to handle requests other than GET or POST.
- `ejs` is used to render views.
- `dotenv` is used to access the .env file that stores the connection string to MongoDB.
- `nodemon` is a dev dependency used to run the server and incorporate any new changes when index.js or its imported modules are modified without manually rerunning the server.

## Endpoints

