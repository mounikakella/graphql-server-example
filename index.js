const { ApolloServer, gql } = require("apollo-server");
var _ = require("lodash");
const mongoose = require("mongoose");
// This is a (sample) collection of books we'll be able to query
// the GraphQL server for.  A more complete example might fetch
// from an existing data source like a REST API or database.

mongoose.connect("mongodb://127.0.0.1:27017/test");
mongoose.connection.once("open", () => {
  console.log("connected to database");
});
var Schema = mongoose.Schema;
var bookSchema = new Schema({
  id: String,
  title: String,
  author: Number,
  likes: Number
});
var authorSchema = new Schema({
  id: String,
  name: String,
  age: Number,
  bookId: Number
});
var BooksModel = mongoose.model("Books", bookSchema);
var AuthorsModel = mongoose.model("Authors", authorSchema);

// Authors.create({
//   id: 1,
//   name: "J.K. Rowling",
//   age: "26",
//   bookId: 2
// })
//   .then(author => {
//     console.log("author success", author);
//   })
//   .catch(e => {
//     console.log(e);
//   });

const books = [
  {
    id: 1,
    title: "Harry Potter and the Chamber of Secrets",
    author: 2,
    likes: 10
  },
  {
    id: 2,
    title: "Jurassic Park",
    author: 2,
    likes: 7
  }
];

const authors = [
  {
    _id: "5d393436bf1e7d7cfc203b49",
    id: "1",
    name: "J.K. Rowling",
    age: 26,
    bookId: 2
  },
  {
    _id: "5d39343cbf1e7d7cfc203b51,",
    id: "2",
    name: "Michael Crichton",
    age: 27,
    bookId: 2
  }
];

// Type definitions define the "shape" of your data and specify
// which ways the data can be fetched from the GraphQL server.
const typeDefs = gql`
  type Query {
    books: [Books]
    book(_id: String!): [Book]
    authors: [Authors]
    author(_id: String!): [Author]
  }
  type Books {
    _id: String
    id: Int
    title: String
    author: Int
    likes: Int
  }
  type Book {
    _id: String
    title: String
    likes: Int
    author: [Author]
  }
  type Authors {
    _id: String
    id: Int
    name: String
    age: Int
    bookId: Int
  }
  type Author {
    _id: String
    name: String
    age: String
    bookId: Int
    books: [Book]
  }
  type Mutation {
    likeBook(bookId: Int!): [Book]
    createBook(id: Int!, title: String!, author: Int!, likes: Int): Books
    createAuthor(id: Int!, name: String!, age: Int, bookId: Int!): Authors
  }
`;

// Resolvers define the technique for fetching the types in the
// schema.  We'll retrieve books from the "books" array above.
const resolvers = {
  Query: {
    books: async () => {
      const res = await BooksModel.find({});
      return res;
    },
    book: async (_, { _id }) => {
      console.log("_id", _id);
      const res = await BooksModel.findById(_id);
      console.log("res", res);
      return res;
    },
    authors: async () => {
      const res = await AuthorsModel.find({});
      return res;
    },
    author: async (_, { _id }) => {
      console.log("_id:", _id);
      const res1 = await AuthorsModel.findById(_id);
      console.log("res1", prepare(res1));
      const res = await authors.filter(author => author.id == 2);
      console.log("res", res);
      return res;
      // return prepare(res1);
      // return prepare(await AuthorsModel.findById(_id));
    }
  },
  Book: {
    author: async (parent, args, context, info) => {
      console.log("parent", parent);
      const authors = await AuthorsModel.find({});
      const res = authors.filter(author => author.bookId == parent.id);
      // const res = BooksModel.find({ bookId: parent.id });
      return res;
    }
  },
  Author: {
    books: (parent, args, context, info) =>
      books.filter(book => book.author == parent.bookId)
  },
  Mutation: {
    createBook: async (parent, args, context, info) => {
      const res = await BooksModel.create(args);
      return prepare(await BooksModel.findOne({ _id: res._id }));
    },
    createAuthor: async (parent, args, context, info) => {
      const res = await AuthorsModel.create(args);
      return prepare(await AuthorsModel.findOne({ _id: res._id }));
    }
  }
};

const prepare = o => {
  o._id = o._id.toString();
  return o;
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
