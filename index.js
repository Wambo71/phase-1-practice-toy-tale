document.addEventListener("DOMContentLoaded", () => {
  fetchToys();
});

const toyCollection = document.getElementById("toy-collection");

function fetchToys() {
  fetch("http://localhost:3000/toys")
    .then((res) => res.json())
    .then((toys) => {
      toys.forEach((toy) => renderToy(toy));
    });
}

function renderToy(toy) {
  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `
    <h2>${toy.name}</h2>
    <img src="${toy.image}" class="toy-avatar" />
    <p>${toy.likes} Likes</p>
    <button class="like-btn" id="${toy.id}">Like ❤️</button>
  `;
  toyCollection.appendChild(card);

  // Add like event listener
  card.querySelector(".like-btn").addEventListener("click", () => {
    increaseLikes(toy);
  });
}


const toyForm = document.querySelector(".add-toy-form");

toyForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = e.target.name.value;
  const image = e.target.image.value;

  const newToy = {
    name: name,
    image: image,
    likes: 0,
  };

  fetch("http://localhost:3000/toys", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(newToy),
  })
    .then((res) => res.json())
    .then((toy) => renderToy(toy));
});


function increaseLikes(toy) {
  const newLikes = toy.likes + 1;

  fetch(`http://localhost:3000/toys/${toy.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ likes: newLikes }),
  })
    .then((res) => res.json())
    .then((updatedToy) => {
      // Update the like count in the DOM
      const toyCard = document.getElementById(updatedToy.id).parentElement;
      toyCard.querySelector("p").textContent = `${updatedToy.likes} Likes`;
      toy.likes = updatedToy.likes; // Update local data too
    });
}
