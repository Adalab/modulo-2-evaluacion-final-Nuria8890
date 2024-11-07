"use strict";

const button = document.querySelector(".js-button");
const input = document.querySelector(".js-input");
const results = document.querySelector(".js-results");

const handleSearch = () => {
  const inputValue = input.value;

  fetch(`https://api.jikan.moe/v4/anime?q=${inputValue}`)
    .then((response) => response.json())
    .then((data) => {
      const series = data.data;

      for (const serie of series) {
        console.log("serie es", serie);
        results.innerHTML += `
        <li>
            <img
              src=${serie.images.jpg.image_url}
              alt=""
            />
            <p>${serie.title}</p>
          </li>
        `;
      }
    });
};

button.addEventListener("click", handleSearch);
