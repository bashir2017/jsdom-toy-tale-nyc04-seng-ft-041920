let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  let toyCollection = document.querySelector("#toy-collection")
  let form = document.querySelector(".add-toy-form")

  //initial loading of data 
  fetch('http://localhost:3000/toys')
  .then(resp => resp.json())
  .then(toys => {
    renderAllToys(toys)
  })

  //handle form submission 
  form.addEventListener("submit", (event) => {
    event.preventDefault()
    const newToy = {
      name: form.name.value,
      image: form.image.value,
      likes: 0
    }
    const config =     {
      method : 'POST',
      body: JSON.stringify(newToy),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    }

    fetch('http://localhost:3000/toys',config)
     .then(resp => resp.json())
     .then(toy => renderToy(toy))
     form.reset()
  })

//render a single toy 
  function renderToy(toy){
    let toyContainer = document.createElement('div')
    toyContainer.classList = 'card'
    toyContainer.dataset.id = toy.id //only if using event delegation 
    toyContainer.innerHTML = `
      <h2>${toy.name}</h2>
      <img src=${toy.image} class="toy-avatar" />
      <p><span>${toy.likes}</span> Likes </p>
      <button class="like-btn">Like <3</button>
    `
    toyCollection.appendChild(toyContainer)
    let likeBtn =  toyContainer.querySelector('button')

    likeBtn.addEventListener('click', () => {
      updateLike(toy.id, toyContainer)
    })
  }

//updated likes count for a toy 
  function updateLike (id, toyContainer){
    let likesSpan = toyContainer.querySelector('span')
    let likes = parseInt(likesSpan.innerText)
    likesSpan.innerText = likes + 1
    const config = {
      method: "PATCH",
      body: JSON.stringify({"likes" : likes + 1}),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    }
    fetch(`http://localhost:3000/toys/${id}`, config)
    .then(resp => resp.json())
    .then(toy => toy)
  }

//redner all toys 
  function renderAllToys(toyObjects){
    toyObjects.forEach((toy) => {
      renderToy(toy)
    })
  }

});
