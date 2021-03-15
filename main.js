//book class: represents a book
class Book{
    constructor(title, author, isbn){
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

//UI class:Handle UI task
class UI {
    static displayBooks() {
        // const StoredBooks = [
        //     {
        //         title: 'Book One',
        //         author: 'Advik',
        //         isbn: '234545'
        //     },
        //     {
        //         title: 'Book two',
        //         author: 'Advik hari',
        //         isbn: '234545'
        //     }
        // ];
        const book = Store.getBooks();
        book.forEach((book)=>UI.addBookToList(book));
    }
    static addBookToList(book){
        const list = document.querySelector('#book-list');

        const row = document.createElement('tr');

        row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>        
        <td>${book.isbn}</td>
        <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `;
        list.appendChild(row);

    }
    static clearFields(){
        document.querySelector('#title').value='';
        document.querySelector('#author').value='';
        document.querySelector('#isbn').value='';
    }
    static deleteElement(el){
        if(el.classList.contains('delete')){
            el.parentElement.parentElement.remove();
        }
    }
    //<div alert alert-sucess//danger>Message</div>
    static showAlert(message, className){
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        //in container div and before form
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        container.insertBefore(div, form);
        //vanish in 3 seconds
        setTimeout(()=> document.querySelector('.alert').remove(), 3000);

    }
}

//store class: handle storage
class Store{
    static getBooks(){
        let books;
        if(localStorage.getItem('books') === null){
            books = [];
        }else{
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;

    }
    static addBook(book){
        const books= Store.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));

    }
    static removeBook(isbn){
        const books = Store.getBooks();
        books.forEach((book, index)=> {
            if(book.isbn === isbn){
                books.splice(index, 1);
            }
        });
        
        localStorage.setItem('books', JSON.stringify(books));
        
        
    }
}

//Event: Display book
document.addEventListener('DOMContentLoaded', UI.displayBooks);


//event: add book
document.querySelector('#book-form').addEventListener('submit',(e)=>{

    e.preventDefault();
     const title = document.querySelector('#title').value;
     const author = document.querySelector('#author').value;
     const isbn = document.querySelector('#isbn').value;
     if(title === '' || author === '' || isbn === ''){
         UI.showAlert('Please fill in all fields', 'danger');
     }else{

     //instantiate class
     const book = new Book(title, author, isbn);
      
     UI.addBookToList(book);

     //Add book to store
     Store.addBook(book);

     //success message
     UI.showAlert('Book Added', 'success');

     //clear fields
     UI.clearFields();
    }


});

//event:remove a book
document.querySelector('#book-list').addEventListener('click',(e)=>{
    //remove book from ui
    UI.deleteElement(e.target);
    //console.log(e.target);

    //remove book from local store
   Store.removeBook(e.target.parentElement.previousElementSibling.textContent)

    
   
   UI.showAlert('Book Removed', 'success');
});