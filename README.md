
## Version 1.0.0
---

# Sample web application

![](./readme-assets/app-screenshot.png)

## Minimal 3 tier web application
- **React frontend:** Uses react query to load data from the two apis and display the result
- **Node JS and Golang APIs:** Both have `/` and `/ping` endpoints. `/` queries the Database for the current time, and `/ping` returns `pong`
- **SQllite Database:** An empty SQLlite database with no tables or data. Used to show how to set up connectivity. The API applications execute `SELECT NOW() as now;` to determine the current time to return.

![](./readme-assets/tech-stack.png)

## Running the Application



The `Makefile` should contain the commands to start each application.


### api-node

To run the node api you will need to run `npm install` to install the dependencies (I used node `v19.4.0` and npm `v9.2.0`).

After installing the dependencies, `make run-api-node` will run the api in development mode with nodemon for restarting the app when you make source code changes.

### api-golang 

To run the golang api you will need to run `go mod download` to download and install the dependencies (I used `go1.19.1`)

After installing the dependencies, `make run-api-golang` will build and run the api.

### client-react

Like `api-node`, you will first need to install the dependencies with `npm install` (again, I used node `v19.4.0` and npm `v9.2.0`)

After installing the dependencies, `make run-client-react` will use vite to run the react app in development mode.