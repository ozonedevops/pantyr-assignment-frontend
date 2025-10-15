# Pantyr Assignment - frontend [Mega Bonus?]
This repository contains a simple web store that uses the GraphQL API that I created in the main Pantyr Assignment.

## Solution
Simple web store using our GraphQL API with the following features:

### Query
- using a paginated query that returns a list of products

### Mutation
- using a mutation to place orders (validate order quantity does not exceed available stock)

### Bonus
- using filtering product list by "price" (min/max)
- using filtering product list by "title contains"
- using sorting product list by product "title" 
- using sorting product list by product "price"

### Super Bonus
- using a mutation to update product stock (validate stock is positive integer)
- using a mutation to update product price (validate price is positive)
- using a mutation to add new product (validate stock is positive integer, price is positive, title is not empty, auto assign product ID)

- to be added:
    - using a mutation to update product title (validate title is not empty)
    - using a query to show a single product of interest by id
    - using a query to show orders by user
    - using a query to show products that have a low stock
    - using a query to show store metrics (total orders and total revenue)


## Requirements
- [ozonedevops/Pantyr Assignment GraphQL API] (https://github.com/ozonedevops/pantyr-assignment)

## Usage
- clone the https://github.com/ozonedevops/pantyr-assignment repository to your machine
- clone the https://github.com/ozonedevops/pantyr-assignment-frontend repository to your machine
- install nodeJS if you haven't already: https://nodejs.org/en/download
- install the dependencies for both repositories (open terminal in each cloned directory and run `npm i`)
- open a new terminal in the pantyr-assignment directory and run: *npm run start:watch* to start the GraphQL API
- open a new terminal in the pantyr-assignment-frontend directory and run: *npm run dev* to start the simple webstore
- open a browser and go to: *http://localhost:5173/* This wil open the simple web store that demonstrates the use of the GraphQL api created in the Pantyr assignment

## Preview:
![Screenshot of Pantyr Web Store Frontend that demonstrates the use of the GraphQL API that was made for the Pantyr assignment, Shop page (light mode).](/screenshots/Pantyr-assignment-frontend-Shop-Cart-Summary.png)
Figure 1: Shop page [light mode]

![Screenshot of Pantyr Web Store Frontend that demonstrates the use of the GraphQL API that was made for the Pantyr assignment, Admin page (light mode).](/screenshots/Pantyr-assignment-frontend-Admin-Panel.png)
Figure 2: Admin page [light mode]

![Screenshot of Pantyr Web Store Frontend that demonstrates the use of the GraphQL API that was made for the Pantyr assignment, Shop page (dark mode).](/screenshots/Pantyr-assignment-frontend-Shop-Cart-Summary-dark.png)
Figure 3: Shop page [dark mode]

![Screenshot of Pantyr Web Store Frontend that demonstrates the use of the GraphQL API that was made for the Pantyr assignment, Admin page (dark mode).](/screenshots/Pantyr-assignment-frontend-Admin-Panel-dark.png)
Figure 4: Admin page [dark mode]

