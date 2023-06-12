const apikey = 'api_key=a72013bef9d421559ffc49b5f0a02dcd';
const base_url = 'https://api.themoviedb.org/3/';
const api_url = base_url + '/discover/movie?sort_by=popularity.desc&' + apikey;
const img_url = 'https://image.tmdb.org/t/p/w500';
const searchUrl = base_url + '/search/movie?' + apikey;

const genres = {
    "genres": [
        {
            "id": 28,
            "name": "Action"
        },
        {
            "id": 12,
            "name": "Adventure"
        },
        {
            "id": 16,
            "name": "Animation"
        },
        {
            "id": 35,
            "name": "Comedy"
        },
        {
            "id": 80,
            "name": "Crime"
        },
        {
            "id": 99,
            "name": "Documentary"
        },
        {
            "id": 18,
            "name": "Drama"
        },
        {
            "id": 10751,
            "name": "Family"
        },
        {
            "id": 14,
            "name": "Fantasy"
        },
        {
            "id": 36,
            "name": "History"
        },
        {
            "id": 27,
            "name": "Horror"
        },
        {
            "id": 10402,
            "name": "Music"
        },
        {
            "id": 9648,
            "name": "Mystery"
        },
        {
            "id": 10749,
            "name": "Romance"
        },
        {
            "id": 878,
            "name": "Science Fiction"
        },
        {
            "id": 10770,
            "name": "TV Movie"
        },
        {
            "id": 53,
            "name": "Thriller"
        },
        {
            "id": 10752,
            "name": "War"
        },
        {
            "id": 37,
            "name": "Western"
        }
    ]
}

const main = document.getElementById('main');
const form = document.getElementById('form');
const search = document.getElementById('search');

const tagsElement = document.getElementById('tags');

const prev = document.getElementById('prev');
const next = document.getElementById('next');
const current = document.getElementById('current');

var currentpage = 1;
var nextpage = 2;
var prevpage = 3;
var lasturl = '';
var totalpages = 100;

var selectedgenre = []
setGenres();
function setGenres()
{
    tagsElement.innerHTML = '';
    genres.genres.forEach(genre =>
    {
        const tag = document.createElement('div');
        tag.classList.add('tag');
        tag.id = genre.id;
        tag.innerText = genre.name;
        tag.addEventListener('click', () =>
        {
            if (selectedgenre.length == 0)
            {
                selectedgenre.push(genre.id);
            } else
            {
                if (selectedgenre.includes(genre.id))
                {
                    selectedgenre.forEach((id, idx) =>
                    {
                        if (id == genre.id)
                        {
                            selectedgenre.splice(idx, 1);
                        }
                    })
                } else
                {
                    selectedgenre.push(genre.id);
                }
            } console.log(selectedgenre);
            getMovies(api_url + '&with_genres=' + encodeURI(selectedgenre.join(',')));
            hilightSelection();
        })
        tagsElement.append(tag);
    })
}
function hilightSelection()
{
    const tags = document.querySelectorAll('.tag');
    tags.forEach(tag =>
    {
        tag.classList.remove('highlight');
    });
    cleatbtn();
    if (selectedgenre.length != 0)
    {
        selectedgenre.forEach(id =>
        {
            const hilightSelection = document.getElementById(id);
            hilightSelection.classList.add('highlight');
        })
    }
}


function cleatbtn()
{
    let clearbtn = document.getElementById('clear');
    if (clearbtn)
    {
        clearbtn.classList.add('highlight');
    } else
    {
        let clear = document.createElement('div');
        clear.classList.add('tag', 'highlight');
        clear.id = 'clear';
        clear.innerText = 'clear x';
        clear.addEventListener('click', () =>
        {
            selectedgenre = [];
            setGenres();
            getMovies(api_url)
        })
        tagsElement.append(clear);
    }
}

getMovies(api_url);

async function getMovies(url)
{
    lasturl = url;

    try
    {
        const res = await fetch(url);
        const data = await res.json();
        showMovies(data.results);
        console.log(data.results)
        if (data.results.length !== 0)
        {
            showMovies(data.results);
            currentpage = data.page;
            nextpage = currentpage + 1;
            prevpage = currentpage - 1;
            totalpages = data.total_pages;
            current.innerText = currentpage;

            if (currentpage <= 1)
            {
                prev.classList.add('disabled');
                next.classList.remove('disable');
            } else if (currentpage >= totalpages)
            {
                prev.classList.remove('disabled');
                next.classList.add('disable');
            } else
            {
                prev.classList.remove('disabled');
                next.classList.remove('disable');
            }
            tagsElement.scrollIntoView({ behavior: 'smooth' });
        } else
        {
            main.innerHTML = `<h1 class="no_results">no results found</h1>`;
        }
    } catch (error)
    {
        console.log(error);
    }
}

function showMovies(data)
{
    const fragment = document.createDocumentFragment();

    data.forEach((movie) =>
    {
        const { title, poster_path, vote_average, overview, id } = movie;
        const movieElement = document.createElement('div');
        movieElement.classList.add('movie');
        movieElement.innerHTML = `
        <img src="${img_url + poster_path}" alt="${title}">
        <div class="movie-info">
            <h3>${title}</h3>
            <span class="${getColor(vote_average)}">${vote_average}</span>
        </div>
        <div class="overview">
            <h3>Overview</h3>
            ${overview}
            <br/>
            <button class="know-more" id="${id}">know more</button>
        </div>
        `;

        fragment.appendChild(movieElement);

    movieElement.querySelector('.know-more').addEventListener('click', () =>
        {
        console.log(id);
        openNav(movie);


    });
        


    });

    main.innerHTML = '';
    main.appendChild(fragment);
}



const overlayContent =document.getElementById('overlay-content')
function openNav(movie)
{
    let id = movie.id;
    fetch(base_url + '/movie/' + id + '/videos?' + apikey).then(res => res.json()).then(videodata =>
    {
        console.log(videodata);
        if (videodata)
        {
            document.getElementById('myNav').style.width = "100%";
            if (videodata.results.length > 0 )
            {
                var embed = [];
                
                videodata.results.forEach(vidoe =>
                {
                    let { name, key, site } = vidoe
                    if (site == 'YouTube')
                    {
                        embed.push(`
                    <iframe width="560" height="315" src="https://www.youtube.com/embed/${key}" title="${name}" class="embed hide" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
                    `) }
                    
                })
                showvideos();
                overlayContent.innerHTML = embed.join('');
                activslide = 0;
                showvideos();
            } else
            {
                overlayContent.innerHTML = `<h1 class="no_results">no results found</h1>`;
            }
        }
        })
        document.getElementById("myNav").style.width = "100%";
}

    function closeNav() {
        document.getElementById("myNav").style.width = "0%";
}

var activslide = 0;
var totalvideo = 0;

function showvideos()
{
    let embedClasses = document.querySelectorAll('.embed');
    totalvideo = embedClasses.length;
    embedClasses.forEach((embedtag, idx) =>
    {
        if (activslide == idx)
        {
            embedtag.classList.add('show');
            embedtag.classList.remove('hide');
        } else
        {
            embedtag.classList.add('hide');
            embedtag.classList.remove('show');
        }
    })
    
        
}
const leftArrow = document.getElementById('left-arrow');
const rightArrow = document.getElementById('right-arrow');

leftArrow.addEventListener('click', () =>
{
    if (activslide >0 )
    {
        activslide--;
    } else
    {
        activslide = totalvideo - 1;
    }

    showvideos();
})

rightArrow.addEventListener('click', () =>
{
    if (activslide <(totalvideo -1) )
    {
        activslide++;
    } else
    {
        activslide = 0 ;
    }

    showvideos();
})


function getColor(vote)
{
    if (vote >= 8)
    {
        return 'green';
    } else
    {
        return 'oranged';
    }
}

form.addEventListener('submit', async (e) =>
{
    e.preventDefault();

    const searchTerm = search.value;
    selectedgenre = [];
    setGenres();
    if (searchTerm)
    {
        const searchUrlWithQuery = searchUrl + '&query=' + searchTerm;
        await getMovies(searchUrlWithQuery);
        search.value = '';
    }
});

prev.addEventListener('click', () =>
{
    if (prevpage > 0)
    {
        pagecall(prevpage);
    }
})

next.addEventListener('click', () =>
{
    if (nextpage <= totalpages)
    {
        pagecall(nextpage);
    }
})


function pagecall(page)
{
    let urlsplit = lasturl.split('?');
    let queryprams = urlsplit[1].split('&');
    let key = queryprams[queryprams.length - 1].split('=');
    if (key[1] != 'page')
    {
        let url = lasturl + '&page=' + page;
        getMovies(url);
    } else
    {
        key[1] = page.toString();
        let a = key.join('=');
        queryprams[queryprams.length * -1] = a;
        let b = queryprams.join('&');
        let url = urlsplit[0] + '?' + b;
        getMovies(url);
    }
}