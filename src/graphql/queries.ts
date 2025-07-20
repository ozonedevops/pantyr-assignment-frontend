import { gql } from '@apollo/client';

export const GET_PRODUCTS = gql`
  query Products(
    $first: Int!
    $after: String
    $filter: ProductFilterInput
    $sort: ProductSortInput
  ) {
    products(first: $first, after: $after, filter: $filter, sort: $sort) {
      edges {
        node {
          id
          title
          price
          stock
        }
        cursor
      }
      pageInfo {
        endCursor
        hasNextPage
      }
      totalCount
    }
  }
`;


export const ADD_PRODUCT = gql`
  mutation AddProduct($input: AddProductInput!) {
    addProduct(input: $input) {
      id
      title
      price
      stock
    }
  }
`;

export const UPDATE_PRODUCT_PRICE = gql`
  mutation UpdateProductPrice($productId: Int!, $price: Float!) {
    updateProductPrice(productId: $productId, price: $price) {
      id
      price
    }
  }
`;

export const UPDATE_PRODUCT_STOCK = gql`
  mutation UpdateProductStock($productId: Int!, $stock: Int!) {
    updateProductStock(productId: $productId, stock: $stock) {
      id
      stock
    }
  }
`;
