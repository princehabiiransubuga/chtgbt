let isLoading = false;
let isInitializing = true;
let jokes = [];
const numberOfJokesToShow = 10;

$(document).ready(function () {
  document.querySelector("#search-button").addEventListener("click",function(e){
     loadJokes()
  })
  $(window).scroll(handleScroll);
  $("#loader").hide();
});

function loadJokes() {
  let searchTerm=document.querySelector("#search-input").value
  const settings = {
    async: true,
    crossDomain: true,
    url: `https://matchilling-chuck-norris-jokes-v1.p.rapidapi.com/jokes/search?query=${searchTerm}`,
    method: "GET",
    headers: {
      accept: "application/json",
      "X-RapidAPI-Key": "7b52f4b4d5msh99ef5e66de3084ap10f926jsn781ec0f99e03",
      "X-RapidAPI-Host": "matchilling-chuck-norris-jokes-v1.p.rapidapi.com"
    }
  };
  $.ajax(settings).done(function (response) {
    isInitializing = false;
    jokes = response.result;
    displayJokes();
  });
}

function handleScroll() {
  if (!isLoading && !isInitializing && $(window).scrollTop() == $(document).height() - $(window).height()) {
    displayJokes();
  }
}

async function displayJokes() {
  isLoading = true;
  $("#loader").show();
  console.log("show")
  
  let promises = [];
  let htmlString = "";

  for (let count = 0; count < numberOfJokesToShow; ++count) {
    promises.push(getJokeResponse(jokes[Math.floor(Math.random()*jokes.length)]));
  }
  
  Promise.all(promises).then(results => {
    results.forEach(result => {
      htmlString += result;
    });
    document.querySelector("#card-container").innerHTML += htmlString;
    isLoading = false;
    $("#loader").hide();
    console.log("hide")
  });
}

async function getJokeResponse(joke) {
  return new Promise((resolve) => {
    const settings = {
      url: "https://api.openai.com/v1/chat/completions",
      type: "POST",
      dataType: "json",
      headers: {
        Authorization: "Bearer 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",
        "Content-Type": "application/json"
      },
      data: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: `as chuck norris respond with humor to the following: ${joke.value}`
          }
        ]
      })
    };

    $.ajax(settings)
      .done(function (data) {
        const jokeResponse = data.choices[0].message.content;
        let jokeCard = renderJoke(joke, jokeResponse);
        resolve(jokeCard);
      })
      .fail(function () {
        setTimeout(() => {
          resolve();
        }, 5000);
      });
  });
}

function renderJoke(joke, jokeResponse) {
  console.log(joke,jokeResponse)
  let htmlString =`
           <div class="card">
        <div class="content">
            <div class="front">
                
                    
                        Joke:
                    
                    
                        ${joke.value}
                    
                
            </div>
            <div class="back">
                
                    
                       Response
                     
                    
                       ${jokeResponse}
                    
               
            </div>
             </div>
    </div>`;
    return htmlString;
}
