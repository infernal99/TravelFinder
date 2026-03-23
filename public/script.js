async function searchCountry() {

    const country = document.getElementById("countryInput").value;

    const loading = document.getElementById("loading");
    loading.style.display = "block";

    try {

        const response = await fetch(
            `https://restcountries.com/v3.1/name/${country}`
        );

        if (!response.ok) {
            throw new Error("País no trobat");
        }

        const data = await response.json();
        const countryData = data[0];

        const resultDiv = document.getElementById("result");

        resultDiv.innerHTML = `
            <h3>${countryData.name.common}</h3>
            <p>Capital: ${countryData.capital}</p>
            <p>Població: ${countryData.population}</p>
            <img src="${countryData.flags.png}" width="100">
            <br><br>
            <button onclick="addFavorite(
                '${countryData.name.common}',
                '${countryData.capital}',
                '${countryData.population}',
                '${countryData.flags.png}'
            )">
            Afegir a favorits
            </button>
        `;

    } catch (error) {

        document.getElementById("result").innerHTML =
            "<p>Error: país no trobat</p>";
    }

    loading.style.display = "none";
}

// afegir favorit
async function addFavorite(country, capital, population, flag) {

    await fetch("/favorites"), {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            country,
            capital,
            population,
            flag
        })
    };

    loadFavorites();
}

// carregar favorites
async function loadFavorites() {

    const response = await fetch("/favorites");
    const data = await response.json();

    const list = document.getElementById("favorites");
    list.innerHTML = "";

    data.forEach(f => {

        const li = document.createElement("li");

        li.innerHTML = `
        <strong>${f.country}</strong> - ${f.capital} - ${f.population}
        <br>
        <img src="${f.flag}" width="50">
        <br>
        <button onclick="deleteFavorite(${f.id})">Eliminar</button>
        <hr>
        `;

        list.appendChild(li);
    });
}

// eliminar
async function deleteFavorite(id) {

    await fetch(`/favorites/${id}`, {
        method: "DELETE"
    });

    loadFavorites();
}

// carregar al iniciar
loadFavorites();