import { gql } from '@apollo/client';

export const PLACE_MULTI_ORDER = gql`
  mutation PlaceMultiOrder($orderedBy: String!, $products: [ProductMultiOrderInput!]!) {
    placeMultiOrder(orderedBy: $orderedBy, products: $products) {
      id
      orderedBy
      products
    }
  }
`;
