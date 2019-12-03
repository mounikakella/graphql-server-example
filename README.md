# graphql-server-example
graphql server example
To get list of books:
```{
  books{
    title
    author
  }
}```

To get list of Authors
```{
  authors{
    name
    age
    bookId
  }
}```

Book by Id and other details:
```{
  book(id: 2){
     title
     author{
       name
    	 age
    }
  }
}```

Author by Id and list of books by author
```{
  author(id: 2){
    name
    age
    books {
      title
    }
	}
}```
