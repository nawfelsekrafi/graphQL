const graphql = require("graphql");
const _ = require("lodash");
const Book = require("../models/book");
const Author = require("../models/author");

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull
} = graphql;

// dummy data
// var books = [
//   { name: "Name of the Wind", genre: "Fantasy", authorId: "6289245b71686e8d66250823" },
//   { name: "The Final Empire", genre: "Fantasy", authorId: "6289247771686e8d66250825" },
//   { name: "The Hero of Ages", genre: "Fantasy", authorId: "6289247771686e8d66250825" },
//   { name: "The Long Earth", genre: "Sci-Fi",  authorId: "6289249771686e8d66250827" },
//   { name: "The Colour of Magic", genre: "Fantasy", authorId: "6289249771686e8d66250827" },
//   { name: "The Light Fantastic", genre: "Fantasy", authorId: "6289249771686e8d66250827" },
// ];
// var authors = [
//   { name: "Patrick Rothfuss", age: 44, id: "6289245b71686e8d66250823" },
//   { name: "Brandon Sanderson", age: 42, id: "6289247771686e8d66250825" },
//   { name: "Terry Pratchett", age: 66, id: "6289249771686e8d66250827" },
// ];

const BookType = new GraphQLObjectType({
  name: "Book",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
    author: {
      type: AuthorType,
      resolve(parent, args) {
        return  Author.findById(parent.authorId);
        // return _.find(authors, { id: parent.authorId });
      },
    },
  }),
});

const AuthorType = new GraphQLObjectType({
  name: "Author",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        return Book.find({ authorId : parent.id})
        // return _.filter(books, { authorId: parent.id });
      },
    },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    // name like book is important because we gonna
    // use that in the frontend
    book: {
      type: BookType,
      // we use that to get book by id
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Book.findById(args.id);
        // code to get data from db/other source
        // return _.find(books, { id: args.id });
      },
    },
    author: {
      type: AuthorType,
      // we use that to get book by id
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Author.findById(args.id);
        // code to get data from db/other source
        // return _.find(authors, { id: args.id });
      },
    },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        return Book.find({});
        // return books;
      },
    },
    authors: {
      type: new GraphQLList(AuthorType),
      resolve(parent, args) {
        return Author.find({});
        // return authors;
      },
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addAuthor: {
      type: AuthorType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve(parent, args) {
        let author = new Author({
          name: args.name,
          age: args.age,
        });
        return author.save();
      },
    },
    addBook: {
      type: BookType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        genre: { type: new GraphQLNonNull(GraphQLString) },
        authorId: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        let book = new Book({
          name: args.name,
          genre: args.genre,
          authorId: args.authorId
        });
        return book.save();
      },
    },
  },
});


//add Mutation to module.exports
module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
