const apikey = 'api_key=a72013bef9d421559ffc49b5f0a02dcd';
const base_url = 'https://api.themoviedb.org/3/';
const api_url = base_url + '/discover/movie?sort_by=popularity.desc&' + apikey;
const img_url = 'https://image.tmdb.org/t/p/w500';
const searcgUrl = base_url + '/search/movie?' + apikey;

const main =document.getElementById('main')
const form = document.getElementById('form')
const search = document.getElementById('search')

getMovies(api_url);

function getMovies(url)
{
    fetch(url).then(res => res.json()).then(data =>
    {
        console.log(data.results)
        showMovies(data.results);
    })
}


function showMovies(data)
{
    main.innerHTML = '';
    data.forEach(movie =>
    {
        const {title,poster_path,vote_average,overview,}= movie;
        const movieele = document.createElement('div');
        movieele.classList.add('movie');
        movieele.innerHTML = `
        <img src="${img_url + poster_path}" alt="${title}">
            <div class="movie-info">
                <h3>${title}</h3>
                <span class="${getColor(vote_average)}">${vote_average}</span>
            </div>
            <div class="overview">
                <h1>overview</h1>
                ${overview}
        
            </div>
        `

        main.appendChild(movieele)
    });
}

function getColor(vote)
{
    if (vote >= 8)
    {
        return 'green';
    } else if (vote <= 5)
    {
        return 'red'
    } else if (vote >= 5)
    {
        return 'red'

    }
};

form.addEventListener('submit', (e) =>
{
    e.preventDefault();

    const searchTerm = search.value;

    if (searchTerm)
    {
        const searchUrl = searcgUrl + '&query=' + searchTerm;
        getMovies(searchUrl);
        search.value = '';
    }
});