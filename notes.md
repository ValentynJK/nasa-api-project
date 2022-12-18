## Setting server using built-in `http`:
* High organization of the code
* Separation between `server` code and `express` code
* Allow to respond not only http request but **other** connections like `WebSocket` for real-time communication

# Structure 

`server` - actual server
`app` - express middleware
`routes` - collection of end points `.route` and controllers `.controller`
  controllers are kept near router due to "close cooperation" between those codes. Route makes direct use of controller.
 
`models` - holds all data related logic


# Notes

## Questions
  1. Should we avoid ";" or no?
  2.  

## Controllers
* There is one-to-one connection between `controller` and `router`
* it is better to declare `controller` using `function` key word, so Node error handler could point on named function in case of code break;
* always add response status via `res.status(200/400)` before response itself;
* it recommended to `return` response, so there is **only one** response in controller (not common pattern but good idea);
* common practice not to over complicate controller with data transformation, try to leave it in `model` 

## Models
* piece of code to work with the raw data??
* **many** models could be used in one controller 

## Streams
Node streams (like in [`planets.module.js`]('../../server/src/models/planets.model.js')) has **async** nature and `module.exports` is **sequential** 

## Importing
* import built-ins above 3rd-party libraries

## Best Practices
1. Automate flow using scripts in `package.json`. 
  * `&&` waits before previous action completer
  * `&` runs independently of previous
  * `--prefix` specify the root folder 
2. `"build": "BUILD_PATH=../server/public react-scripts build",` creates `build` folder in server folder 
3. [morgan](https://www.npmjs.com/package/morgan) request logger middleware
4. relate to separation of concern [SoC](https://nalexn.github.io/separation-of-concerns/) and (Layered Architecture)[https://www.vadimbulavin.com/layered-architecture-ios/]
5. `isNaN(value)` calls .valueOf() of **value** and converts it to number first 
6. Pay attention to the headers
7. Export functions in the same order as function definitions
8. request params are **always** strings!! 
9. `watch` is more common name for `dev nodemon` script. For example `jest` library comes with built-in `'jest --watch'` script
10. Add versioning to your API ([lesson 188](https://www.udemy.com/course/complete-nodejs-developer-zero-to-mastery/learn/lecture/26231498#questions))
11. 
  

## Questions
1.  Using FormDate object for form submission?  
2. How to prevent overuse of server CPU capacity by users?


## Testing
1. Jest
2. [supertest](https://www.npmjs.com/package/supertest) for API testing. Makes request against our API
3. In case of testing with 3-rd part Mongo connect database before tests and disconnect after
4. Preset to use JEST test with 3-rd part MongoDB
   1. "scripts": {
        ...
        `"test": "jest --detectOpenHandles",`
        ...    
      },
    ...
    "license": "ISC",
    `"jest": { "testEnvironment": "node" }`
    ...


## Clusters and improving Node performance
1. To use clusters you need to make your node process state less. Keep information in db