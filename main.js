const micButton = document.getElementById("mic");
const playback = document.querySelector(".playback");
const result = document.querySelector(".recognition-result");
const textInput = document.getElementById("text-input");
const lookupButton = document.getElementById("lookup");

let mediaRecorder;
let audioChunks = [];
let recognition;
let isRecording = false;

micButton.addEventListener("click", async () => {
  if (isRecording) {
    await stopRecording();
  } else {
    await startRecording();
  }
});

textInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    const query = this.value;
    fetchRecipe(query);
  }
});

lookupButton.addEventListener("click", function () {
  let input = textInput.value;
  fetchRecipe(input);
});

function fetchRecipe(query) {
  fetch("http://localhost:3000/extract", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text: query }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.food) {
        searchRecipe(data.food);
      } else {
        result.textContent = "Could not extract food item from query: " + query;
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      result.textContent = "Failed to process query. Please try again.";
    });
}

async function startRecording() {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  mediaRecorder = new MediaRecorder(stream);
  mediaRecorder.start();

  audioChunks = [];

  mediaRecorder.ondataavailable = (event) => {
    audioChunks.push(event.data);
  };

  mediaRecorder.onstop = async () => {
    const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
    const audioUrl = URL.createObjectURL(audioBlob);
    playback.src = audioUrl;
    audioChunks = [];
  };

  micButton.classList.add("is-recording");
  isRecording = true;

  startSpeechRecognition();
}

async function stopRecording() {
  if (mediaRecorder) {
    mediaRecorder.stop();
  }
  if (recognition) {
    recognition.stop();
  }
  micButton.classList.remove("is-recording");
  isRecording = false;
}

function startSpeechRecognition() {
  if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
    alert(
      "Your browser doesn't support speech recognition. Please try with a supported browser."
    );
    return;
  }

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onresult = (event) => {
    const speechResult = event.results[0][0].transcript;
    result.textContent = `You said: ${speechResult}`;
    fetchRecipe(speechResult);
  };

  recognition.onerror = (event) => {
    console.error("Speech recognition error:", event.error);
    alert("Speech recognition error. Please try again.");
  };

  recognition.onend = () => {
    if (isRecording) {
      recognition.start();
    }
  };

  recognition.start();
}

async function searchRecipe(query) {
  const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(
    query
  )}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.meals) {
      const firstRecipe = data.meals[0];

      let ingredients = "";
      for (let i = 1; i <= 20; i++) {
        let ingredient = firstRecipe[`strIngredient${i}`];
        let measure = firstRecipe[`strMeasure${i}`];
        if (ingredient && measure.trim() !== "") {
          ingredients += `<li>${ingredient} - ${measure}</li>`;
        }
      }
      result.innerHTML = `
        <strong>Recipe Found:</strong> ${firstRecipe.strMeal} <br />
        <strong>Ingredients: </strong>
        <ul>${ingredients}</ul> 
        <strong>Instructions:</strong> ${firstRecipe.strInstructions} <br />
        <img src="${firstRecipe.strMealThumb}" alt="Recipe Image"/> <br />
        <a href=${firstRecipe.strYoutube}>Instructions on Youtube</a>
      `;
    } else {
      result.textContent = "No recipes found for: " + query;
    }
  } catch (error) {
    console.error("Failed to fetch recipes", error);
    result.textContent = "Failed to search for recipes. Please try again.";
  }
}
