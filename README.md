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
- Vite + React + TypeScript