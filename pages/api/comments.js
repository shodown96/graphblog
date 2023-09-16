import { GraphQLClient, gql } from 'graphql-request';

const graphqlAPI = process.env.NEXT_PUBLIC_GRAPHCMS_ENDPOINT;

/** *************************************************************
* Any file inside the folder pages/api is mapped to /api/* and  *
* will be treated as an API endpoint instead of a page.         *
*************************************************************** */

// export a default function for API route to work
export default async function asynchandler(req, res) {
  const graphQLClient = new GraphQLClient((graphqlAPI), {
    headers: {
      authorization: `Bearer ${process.env.GRAPHCMS_TOKEN}`,
    },
  });

  const createQuery = gql`
    mutation CreateComment($name: String!, $email: String!, $body: String!, $slug: String!) {
      createComment(data: {name: $name, email: $email, body: $body, post: {connect: {slug: $slug}}}) { id }
    }
`;

  const publishQuery = gql`
    mutation PublishComment($id: ID!) {
      publishComment(where: { id: $id }, to: PUBLISHED) {
        id
      }
    }`

  try {
    const { createComment } = await graphQLClient.request(createQuery, {
      name: req.body.name,
      email: req.body.email,
      body: req.body.body,
      slug: req.body.slug,
    });

    // const { publishedComment } = 
    await graphQLClient.request(publishQuery, {
      id: createComment.id,
    });


    return res.status(200).send(createComment);
  } catch (error) {
    console.log(error)
    return res.status(500).send(error);
  }
}
