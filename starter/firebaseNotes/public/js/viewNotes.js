let googleUser;

window.onload = (event) => {
  // Use this to retain user state between html pages.
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log('Logged in as: ' + user.displayName);
      googleUser = user;
      const googleUserId = user.uid;
      getNotes(googleUserId);
    } else {
      // If not logged in, navigate back to login page.
      window.location = 'index.html'; 
    };
  });
};

const getNotes = (userId) => {
  const notesRef = firebase.database().ref(`users/${userId}`);
  notesRef.on('value', (snapshot) => {
    const data = snapshot.val();
    renderData(data);
  });
};

const renderData = (data) => {
    const destination = document.querySelector('#app');
    destination.innerHTML = "";
    for (let key in data) {
        const note = data[key];
        destination.innerHTML += createCard(note, key);
    }
};

const createCard = (note,noteId) => {
    return `<div class="column is-one-quarter">
                <div class="card"> 
                    <header class="card-header"> 
                        <p class="card-header-title"> 
                            ${note.title} 
                        </p> 
                    </header> 
                    <div class="card-content"> 
                        <div class="content">
                            ${note.text} 
                        </div>
                    </div> 
                    <footer class = "card-footer">
                    <a href = "#"
                            class = "card-footer-item"
                            onclick = "editNote('${noteId}')">
                            Edit
                            </a>   
                    <a href = "#"
                            class = "card-footer-item"
                            onclick = "deleteNote('${noteId}')">
                            Delete
                            </a>
                    </footer>
                </div>
            </div>`;
};

const deleteNote = (noteId) => {
    console.log("delete");
    const noteToDeleteRef = firebase.database().ref(`users/${googleUser.uid}/${noteId}`);
    noteToDeleteRef.remove().then()
    
}
const editNote = (noteId) => {
    console.log("Edit note" + noteId)
    const noteToEditRef = firebase.database().ref(`users/${googleUser.uid}/${noteId}`);
    noteToEditRef.once('value', (snapshot) => {
        const note = snapshot.val();
        const editNoteModal = document.querySelector("#editNoteModal");
        const editTitle = document.querySelector("#editTitleInput");
        editTitle.value = note.title;        
        const editText = document.querySelector("#editTextInput");
        editText.value = note.text;


        editNoteModal.classList.add('is-active');
    });
    
}

const closeModal = () => {
    const editNoteModal = document.querySelector("#editNoteModal")
    editNoteModal.classList.remove('is-active');
}

const saveChanges = () => {

        const editTitle = document.querySelector("#editTitleInput");      
        const editText = document.querySelector("#editTextInput");
        const editNoteId = document.querySelector("#editNoteId");

        const title = editTitle.value;
        const text = editText.value;
        const noteId = editNoteId.value;
        const noteRef = firebase.database().ref(`users/${googleUser.uid}/${noteId}`);
        noteRef.update({
            title: title, 
            text: text, 
        });  
             
     closeModal();
}