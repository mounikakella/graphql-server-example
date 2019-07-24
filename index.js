const { ApolloServer, gql } = require("apollo-server");
var _ = require("lodash");
// This is a (sample) collection of books we'll be able to query
// the GraphQL server for.  A more complete example might fetch
// from an existing data source like a REST API or database.
const books = [
  {
    id: 1,
    title: "Harry Potter and the Chamber of Secrets",
    author: 2
  },
  {
    id: 2,
    title: "Jurassic Park",
    author: 2
  }
];

const authors = [
  {
    id: 1,
    name: "J.K. Rowling",
    age: "26",
    bookId: 2
  },
  {
    id: 2,
    name: "Michael Crichton",
    age: "27",
    bookId: 2
  }
];

// Type definitions define the "shape" of your data and specify
// which ways the data can be fetched from the GraphQL server.
const typeDefs = gql`
  type Query {
    books: [Books]
    book(id: ID!): [Book]
    authors: [Authors]
    author(id: ID!): [Author]
  }
  type Books {
    id: Int
    title: String
    author: Int
  }
  type Book {
    title: String
    author: [Author]
  }
  type Authors {
    id: Int
    name: String
    age: Int
    bookId: Int
  }
  type Author {
    name: String
    age: String
    bookId: Int
    books: [Book]
  }
`;

// Resolvers define the technique for fetching the types in the
// schema.  We'll retrieve books from the "books" array above.
const resolvers = {
  Query: {
    books: () => books,
    book: (_, { id }) => books.filter(book => book.id == id),
    authors: () => authors,
    author: (_, { id }) => authors.filter(author => author.id == id)
  },
  Book: {
    author: (parent, args, context, info) =>
      authors.filter(author => author.bookId == parent.id)
  },
  Author: {
    books: (parent, args, context, info) =>
      books.filter(book => book.author == parent.bookId)
  }
};

// In the most basic sense, the ApolloServer can be started
// by passing type definitions (typeDefs) and the resolvers
// responsible for fetching the data for those types.
const server = new ApolloServer({ typeDefs, resolvers });

// This `listen` method launches a web-server.  Existing apps
// can utilize middleware options, which we'll discuss later.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
