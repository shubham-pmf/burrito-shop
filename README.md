# Burrito Shop Application

## Overview
This is a full-stack web application for a Burrito Shop. It includes a backend server built with Express and MongoDB, and a frontend client interface created with React.

## Features
- Dynamic menu with a selection of burritos and condiments.
- Cart functionality for order management.
- Order placement and review system.
- A separate view for chefs to manage orders.

### How to run this app?
- This application is dockerized. 
1. Clone the repo. 
2. Make sure docker desktop is installed, up and running. 
3. In the terminal, navigate to the root of the repo and run the following command:
```
docker-compose up
```
4. Open `localhost:3000` to open the UI, if not already opened. 

## Installation for non-docker setup:

### Prerequisites
- Node.js
- MongoDB
- react.js

### Server Setup
1. Clone the repository and navigate to the server directory.
2. Install the dependencies:
3. Start the MongoDB service.
4. Run the server:


### Client Setup
1. Navigate to the client directory.
2. Install the dependencies:
3. Start the client application:

## API Endpoints
- `/api/burrito` - For managing burrito items.
- `/api/orders` - For placing and viewing orders.
- `/api/condiments` - For managing condiment options.

## Contributing
Contributions to the project are welcome! Feel free to fork the repository and submit pull requests.

## License
This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

