import { gql } from '@apollo/client';

export const PLACE_ORDER = gql`
  mutation PlaceOrder($orderedBy: String!, $products: [Int!]!) {
    placeOrder(orderedBy: $orderedBy, products: $products) {
      id
      orderedBy
      products
    }
  }
`;
