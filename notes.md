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
3. [morgan]('https://www.npmjs.com/package/morgan') request logger middleware
4. relate to separation of concern [SoC](https://nalexn.github.io/separation-of-concerns/) and (Layered Architecture)['https://www.vadimbulavin.com/layered-architecture-ios/']