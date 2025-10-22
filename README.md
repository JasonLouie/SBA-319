# SBA-319

This is a small Node, Express, Mongoose server application that somewhat mimics an admin landing page for anime reviews. Very brief documentation and information on the API can be viewed at the default route of the server. For the purpose of the demo, it is assumed that the client is an administrator to avoid using custom api keys via query string strings or headers and fully showcase the core functionality of this application.


## Dependencies

Below is a list of dependencies for the project and a brief explanation of their purposes.

- `express` is used as the server and handles client requests with routes.
- `mongoose` is used to access the anime_reviews database and its collections in MongoDB.
- `mongoose-sequence` is used to handle an auto incrementing field (_id field in the anime collection). It also creates another collection called counter. For user and development conveniences, the _id in anime should be predictable.
- `method-override` is used to allow forms to handle requests other than GET or POST.
- `ejs` is used to render views.
- `dotenv` is used to access the .env file that stores the connection string to MongoDB.
- `nodemon` is a dev dependency used to run the server and incorporate any new changes when index.js or its imported modules are modified without manually rerunning the server.


## Getting Started

After cloning the repo or downloading it as a .zip (and extracting its contents), create a terminal that accesses the root directory of the project. Run the command `npm i` to install all packages required to run the application. Create a .env file in the root directory and declare the variable `ATLAS_URI` and set it to the MongoDB connection string with valid credentials. Generate a new database named `anime_reviews` was created in MongoDB with three collections: `users`, `anime`, and `reviews`. Include `/anime_reviews` after `mongodb.net`. Next, navigate back to the terminal and enter nodemon. The server will run and the application will connect to the database.


## Status Codes

| Status Code | Description |
| --- | ------- |
| 200 - OK | Successfully retrieved information. |
| 201 - Created | Successfully created new entry. |
| 204 - No Content | Successfully deleted entry. Cascade delete is implemented (if a user or anime is removed, the related ratings are also removed). However, resetting the reviews does not account for this (entries for deleted anime will reappear). |
| 400 - Bad Request | Missing information in a request body, invalid request, including fields in PATCH requests that shouldn't be modified, and failed validation |
| 404 - Not Found | The resource does not exist. |
| 409 - Conflict | Attempting to create a new resource when it already exists. This happens when certain fields (or pair of fields) should be unique. |
| 500 - Internal Server Error | An unexpected error occured when handling the request. |


## Models and Schema

The _id field for user, review, and counter are not declared in the schema, but included because it is part of each document in the respective collection.

| Model Name | Fields | Validation |
| --- | ---- | ------ |
| User ("user") | _id: ObjectId,<br>name: String,<br>username: String (Immutable),<br>email: String,<br>password: String,<br>number_of_reviews: Number (Virtual) | _id: Unique<br>name: String of letters, numbers, underscores, periods, and white space<br>username: Unique string of letters, numbers, underscores, and periods<br>email: Email format and unique<br>password: String of at least 8 characters<br>number_of_reviews: At least 0 |
| Anime ("Anime") | _id: Number,<br>title: String,<br>genres: Array of at least one String enum,<br>status: String enum,<br>type: String enum,<br>premiered: Number (4-digit year),<br>episodes: Number,<br>avg_user_rating: Number (Virtual) | _id: Unique<br>title: Unique<br>genres: See section below about possible genres<br>status: "Ongoing", "Finished", "Not Aired"<br>type: "TV", "Movie", "ONA", "OVA"<br>premiered: Year must be at least 1965<br>episodes: Integer at least 0<br>avg_user_rating: Decimal to the nearest hundredth |
| Review ("review") | _id: ObjectId,<br>anime_id: Number (unique pair with user_id),<br>user_id: ObjectId (unique pair with anime_id),<br>comment: String (Optional),<br>rating: Number | _id: Unique,<br>anime_id: Number (references _id from Anime),<br>user_id: ObjectId (references _id from User),<br>comment: String (Defaults to an empty string and can be left out of request bodies),<br>rating: Number (An integer between 0 and 10 inclusively) |
| Counter ("counter) | _id: ObjectId,<br>id: String (_id),<br>reference_value: String,<br>seq: Number (the counter) | N/A. No validation because this collection exists as a counter for the anime id. |


### Possible Genres

Genres in the Anime schema must be one of the following: "Action", "Adventure", "Award Winning", "Comedy", "Drama", "Fantasy", "Gourmet", "Horror", "Mystery", "Romance", "Sci-Fi", "Slice of Life", "Sports", "Supernatural", "Suspense", "Delinquents", "Detective", "Educational", "Gag Humor", "High Stakes Game", "Historical", "Isekai", "Magic", "Martial Arts", "Mecha", "Medical", "Military", "Music", "Mythology", "Organized Crime", "Otaku Culture", "Parody", "Performing Arts", "Pets", "Psychological", "Racing", "Reincarnation", "Samurai", "School", "Showbiz", "Space", "Strategy Game", "Super Power", "Survival", "Team Sports", "Time Travel", "Vampire", "Video Game", "Visual Arts", "Workplace", "Urban Fantasy", "Villainess".

### Explanation on Fields Chosen for Models

The users model contains a name, username, email, and password. These are the chosen fields because most review sites allow names to be repeated (display names), but usernames must be unique. Emails also must be unique, but can be changed to another one (that does not already exist in the db). The anime models should include a description/summary field, but the basics are kept so that creating the seed data would be easier (descriptions/summaries for anime can be lengthy). A review has an optional comment field because users should be able to rate content without having to leave a comment. Ratings are integers between 0 - 10 because of personal preference.

## Testing and Erroneous Behaviors

Most of the functionality can be tested using the demo endpoint (almost anything that is implemented in the api version can be done using the demo). There was an issue with resetting data (the insertMany reviews would overlook the fact that some of the static anime are no longer in the database). To solve this problem, only one route handles resetting all data.

## Endpoints (API)

The base url for the API endpoint is `localhost:3000/api`. To reset ALL data, use the endpoint `/api/reset`. Code is 200 if the length of the initial and created static data for users, review, and anime are equal. Otherwise, code is 400 (one of the entries did not get inserted).

### Users Endpoint

| Method | Endpoint | Description | Possible Responses & Status Codes |
| --- | ------ | ------ | ----- |
| GET | `/users` | Retrieves all users. | Code is 200. Returns array of User documents. |
| GET | `/users?userId={id}` | Retrieves a particular user with that id using a query string. Accepts an additional limit query string too. | Code is 200 if that user exists and returns the User document.<br>Code is 400 if the id is invalid (not a 24-character hexadecimal representation of an object id)<br>Code is 404 if that user does not exist. |
| GET | `/users/:id` | Retrieves a particular user with that id. | Code is 200 if that user exists and returns the User document.<br>Code is 400 if the id is invalid (not a 24-character hexadecimal representation of an object id)<br>Code is 404 if that user does not exist. |
| GET | `/users/:id/reviews` | Retrieves all reviews for a user with that id. | Code is 200 if that user exists and returns the User review documents. Empty array is returned if the user does not have any reviews.<br>Code is 400 if the id is invalid (not a 24-character hexadecimal representation of an object id)<br>Code is 404 if that user does not exist.<br>Code is 409 if a review with the (anime_id, user_id) pair already exists. |
| POST | `/users` | Creates a new user. | Code is 201 if the body sent contains a name, unique username, unique email, and a password. It must also pass the validation mentioned in the Models and Schema table. Returns the new user document created.<br>Code is 400 if validation fails. Failure in validation can mean missing the mentioned fields which are all required, failing type checks, or failing unique checks. |
| POST | `/users/:id/reviews` | Creates a new review. | Code is 201 if the body sent contains a unique (anime_id, user_id) pair, both must exist in their respective collections, optional comment (can be excluded or empty, but must be a string if included), and an integer rating between 0 and 10 inclusively.<br>Code is 400 if the validation fails. |
| PATCH | `/users/:id` | Finds and updates a particular user with that id. | Code is 200 if that user exists, all validation passes, and returns the modified version of the User document.<br>Code is 400 if the id is invalid (not a 24-character hexadecimal representation of an object id) or validation failed.<br>Code is 404 if that user does not exist. |
| DELETE | `/users/:id` | Finds and deletes a particular user with that id. | Code is 204 if that user exists and the User document was successfully deleted.<br>Code is 400 if the id is invalid (not a 24-character hexadecimal representation of an object id)<br>Code is 404 if that user does not exist. |


### Anime Endpoint

| Method | Endpoint | Description | Possible Responses & Status Codes |
| --- | ------ | ------ | ----- |
| GET | `/anime` | Retrieves all anime. | Code is 200. Returns array of Anime documents. |
| GET | `/anime?animeId={id}` | Retrieves a particular anime with that id using a query string. Accepts an additional limit query string too. | Code is 200 if that anime exists and returns the Anime document.<br>Code is 400 if the id is invalid (not a number)<br>Code is 404 if that anime does not exist. |
| GET | `/anime/:id` | Retrieves a particular anime with that id. | Code is 200 if that anime exists and returns the Anime document.<br>Code is 400 if the id is invalid (not a number)<br>Code is 404 if that anime does not exist. |
| GET | `/anime/:id/reviews` | Retrieves all reviews for a anime with that id. | Code is 200 if that anime exists and returns the Anime review documents. Empty array is returned if the anime does not have any reviews.<br>Code is 400 if the id is invalid (not a number)<br>Code is 404 if that anime does not exist. |
| POST | `/anime` | Creates a new anime. | Code is 201 if the body sent contains a unique title, valid status, valid genres, valid type, valid year premiered, and valid episode count. It must pass the validation mentioned in the Models and Schema table. Returns the new anime document created.<br>Code is 400 if validation fails. Failure in validation can mean missing the mentioned fields which are all required, failing type checks, or failing unique checks. |
| POST | `/anime/:id/reviews` | Creates a new review. | Code is 201 if the body sent contains a unique (anime_id, user_id) pair, both must exist in their respective collections, optional comment (can be excluded or empty, but must be a string if included), and an integer rating between 0 and 10 inclusively.<br>Code is 400 if the validation fails.<br>Code is 409 if a review with the (anime_id, user_id) pair already exists. |
| PATCH | `/anime/:id` | Finds and updates a particular anime with that id. | Code is 200 if that anime exists, all validation passes, and returns the modified version of the Anime document.<br>Code is 400 if the id is invalid (not a number) or validation failed.<br>Code is 404 if that anime does not exist. |
| DELETE | `/anime/:id` | Finds and deletes a particular anime with that id. | Code is 204 if that anime exists and the Anime document was successfully deleted.<br>Code is 400 if the id is invalid (not a number)<br>Code is 404 if that anime does not exist. |


### Review Endpoint

| Method | Endpoint | Description | Possible Responses & Status Codes |
| --- | ------ | ------ | ----- |
| GET | `/reviews` | Retrieves all reviews. | Code is 200. Returns array of Review documents. |
| GET | `/reviews?reviewId={id}` | Retrieves a particular review with that id using a query string. | Code is 200 if that review exists and returns the Review document.<br>Code is 400 if the id is invalid (not a 24-character hexadecimal representation of an object id)<br>Code is 404 if that review does not exist. |
| GET | `/reviews?animeId={id}` | Retrieves reviews with that anime_id using a query string. Accepts an additional limit query string too. | Code is 200 if the anime_id is a number and returns an array of Review documents.<br>Code is 400 if the id is invalid (not a number). |
| GET | `/reviews?userId={id}` | Retrieves reviews with that user_id using a query string. Accepts an additional limit query string too. | Code is 200 if the user_id is valid and returns an array of Review documents.<br>Code is 400 if the id is invalid (not a 24-character hexadecimal representation of an object id). |
| GET | `/reviews/:id` | Retrieves a particular review with that id. | Code is 200 if that review exists and returns the Review document.<br>Code is 400 if the id is invalid (not a 24-character hexadecimal representation of an object id)<br>Code is 404 if that review does not exist. |
| GET | `/reviews/rating/:type` | Retrieves all reviews that are positive (7 and above), negative (below 4), or decent (4-6 inclusively). | Code is 200 if the type is either positive, negative, or decent and returns an array of review documents. Empty array is returned if there aren't any reviews matching the criteria.<br>Code is 400 if the type is invalid (not a string or one of the three types mentioned)<br>Code is 404 if that review does not exist. |
| POST | `/reviews` | Creates a new review. | Code is 201 if the body sent contains a unique (anime_id, user_id) pair, both must exist in their respective collections, optional comment (can be excluded or empty, but must be a string if included), and an integer rating between 0 and 10 inclusively.<br>Code is 400 if the validation fails. Failure in validation can mean missing the mentioned fields which are all required, failing type checks, or failing unique checks.<br>Code is 409 if a review with the (anime_id, user_id) pair already exists. |
| PATCH | `/reviews/:id` | Finds and updates a particular review with that id. | Code is 200 if that review exists, all validation passes, and returns the modified version of the Review document.<br>Code is 400 if the id is invalid (not a 24-character hexadecimal representation of an object id) or validation failed.<br>Code is 404 if that review does not exist. |
| DELETE | `/reviews/:id` | Finds and deletes a particular review with that id. | Code is 204 if that review exists and the Review document was successfully deleted.<br>Code is 400 if the id is invalid (not a 24-character hexadecimal representation of an object id)<br>Code is 404 if that review does not exist. |

## Endpoints (Demo)

The base url for the demo endpoint is `localhost:3000/demo`, but each endpoint below will include the `/demo` prefix. The same validation logic from the previous section applies to the respective document type. Errors are rendered. The title shows the error type and the content in the main body of the page lists out all errors with key: value (key being the field or model with the error and the value being the error). To reset ALL data, use the endpoint `/demo/reset`. If the length of the initial and created static data for users, review, and anime are equal, redirect to the page the reset was initiated (or if this isn't accessible, then the documentation page at `localhost:3000`). Otherwise, code is 400 (one of the entries did not get inserted) and this is displayed in `error.ejs`.

| Method | Endpoint | Description & Response |
| --- | ------ | ------ |
| GET | `/demo/users`<br>`/demo/anime` | Retrieves all documents of that type (anime or users) and renders the respective view `{type}/index.ejs`. Currently no support for query strings. Any errors are shown using `error.js` (although none should appear, but error handling accounts for this). Any errors are shown using `error.ejs`. |
| GET | `/demo/reviews`<br>`/demo/reviews?userId={id}`<br>`/demo/reviews?animeId={id}`<br>`/demo/reviews?limit={num}` | Retrieves all reviews (all, or by userId, or animeId, or a limit amount). Without a query string, it retrieves all reviews and displays them using `reviews/index`. The page title dynamically updates based on the query (except for limit, which works when manually adding it to the url). |
| GET | `/demo/users/:id`<br>`/demo/anime/:id`<br>`/demo/reviews/:id` | Retrieves a particular document with that id and renders the respective view `doc.ejs`. Currently no support for query strings. Any errors are shown using `error.ejs`. |
| POST | `/demo/users`<br>`/demo/anime` | Creates a new doc (user or anime). It must pass the validation specified in the Models and Schema table. Returns the new document created and renders it in the respective view `doc.ejs` if the creation was successful. Any errors are shown using `error.ejs`. |
| POST | `/demo/reviews` | Creates a new review using username and anime title. Initially, it was User Id and Anime Id, but changed it to this format for client simplicity. |
| PATCH | `/demo/users/:id`<br>`/demo/anime/:id`<br>`/demo/reviews/:id` | Finds and updates a particular document with that id and renders the respective view `doc.ejs` if the update was successful. Any errors are shown using `error.ejs`. |
| DELETE | `/demo/users/:id`<br>`/demo/anime/:id`<br>`/demo/reviews/:id` | Finds and deletes a particular document with that id and renders the respective view `doc.ejs` if the deletion was successful. Any errors are shown using `error.ejs`. |