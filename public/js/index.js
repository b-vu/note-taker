$(".save-note").on("click", () => {
  if($(".note-title").val().trim() === "" || $(".note-textarea").val().trim() === ""){
    return;
  }

  const newNote = {
    title: $(".note-title").val().trim(),
    text: $(".note-textarea").val().trim()
  }

  $.post("/api/notes", newNote)
    .then(data => {
      console.log(data);

      loadNotes();
    })
});

$(".new-note").on("click", () => {
  $(".note-title").val("");
  $(".note-textarea").val("");
});

const loadNotes = () => {
  $(".list-group").empty();

  $.get("/api/notes").then(data => {
    if(!data.length){
      $(".note-title").val("");
      $(".note-textarea").val("");
    }
    else if($(".note-title").val().trim() === "" && $(".note-textarea").val().trim() === ""){
      $(".note-title").val(data[0].title);
      $(".note-textarea").val(data[0].text);
    }

    for(const note of data){
      const listItem = $("<div>");
      const header = $("<h3 class='list-group-item'>").text(note.title);
      header.attr("data-id", note.id);
      const span = $("<span>").text(note.title);
      const del = $("<i class='fas fa-trash-alt float-right text-danger delete-note'>");
      del.attr("data-id", note.id);

      header.append(del);
      listItem.append(header);
      $(".list-group").append(listItem);
    }

    for(const note of data){
      if($(".note-title").val() === note.title && $(".note-textarea").val() === note.text){
        $(".note-title").val(note.title);
        $(".note-textarea").val(note.text);
        return;
      }
    }
    $(".note-title").val(data[0].title);
    $(".note-textarea").val(data[0].text);
  })
};

loadNotes();

document.querySelector(".list-group").addEventListener("click", event => {
  if(event.target.matches("i")){
    $.post(`/api/notes/${event.target.getAttribute("data-id")}`)
    .then(data => {
      console.log(data);
      loadNotes();
    });
  }
  else if(event.target.matches("h3")){
    const id = parseInt(event.target.getAttribute("data-id"));
    
    $.get("/api/notes").then(data => {
      for(const note of data){
        if(id === note.id){
          $(".note-title").val(note.title);
          $(".note-textarea").val(note.text);
        }
      }
    })
  }
});