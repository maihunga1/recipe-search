# NLP-Based Recipe Search Application

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

## Introduction

The NLP-Based Recipe Search Application is a web application that leverages Natural Language Processing (NLP) to understand user inputs and fetch corresponding recipes from TheMealDB API. Users can interact with the application via text input or voice commands to search for recipes.

## Features

- Extracts food items from natural language input using NLP.
- Fetches recipe details from TheMealDB API.
- Supports both text and voice input for searching recipes.
- Provides a responsive and user-friendly interface.

## Technologies Used

- **Backend**: Node.js, Express.js
- **NLP**: Compromise.js
- **Frontend**: HTML, CSS, JavaScript
- **API**: TheMealDB API
- **Others**: CORS, Body-parser

## Installation

### Prerequisites

- Node.js (v12.x or higher)
- npm (v6.x or higher)

### Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/maihunga1/recipe-search.git
   cd nlp-recipe-search
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the server:

   ```bash
   node server.js
   ```

## Usage

1. Navigate to `http://localhost:3000` in your web browser.
2. Use the text input field or the microphone button to enter a recipe query.
3. The application will extract the food item from your input and fetch the relevant recipe from TheMealDB API.

## Project Structure

```plaintext
nlp-recipe-search/
├── node_modules/
├── public/
│   ├── index.html
│   ├── style.css
│   └── main.js
├── .gitignore
├── package.json
├── package-lock.json
└── server.js
```

## API Endoints

POST /extract
Extracts food items from the provided text using NLP.

URL: /extract
Method: POST
Headers:
Content-Type: application/json
Body:

```
{
  "text": "I want to make teriyaki chicken"
}
```

Response:

```
{
  "food": "teriyaki chicken"
}
```
