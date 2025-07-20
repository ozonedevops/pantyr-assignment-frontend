# Pantyr Assignment - frontend [Mega Bonus?]
This repository contains a simple web store that uses the GraphQL API that was created in the main Pantyr Assignment.

## Solution
Simple web store using our GraphQL API with the following features:

### Query
- a paginated query that returns a list of products

### Mutation
- a mutation to place orders (validate order quantity does not exceed available stock)

### Bonus
- filtering product list by "price" (min/max)
- filtering product list by "title contains"
- sorting product list by product "title" 
- sorting product list by product "price"

### Super Bonus
- a query to show a single product of interest by id
- a query to show orders by user
- a query to show products that have a low stock
- a query to show store metrics (total orders and total revenue)
- a mutation to update product stock (validate stock is positive integer)
- a mutation to update product price (validate price is positive)
- a mutation to update product title (validate title is not empty)
- a mutation to add new product (validate stock is positive integer, price is positive, title is not empty, auto assign product ID)

