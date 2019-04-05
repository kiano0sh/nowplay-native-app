import gql from "graphql-tag";


export const GET_TOKEN = gql`
    {
        token @client
    }
`;