require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const MOVIES = require('./moviedata.json');

console.log(process.env.API_TOKEN)

const app = express()

app.use(morgan('dev'))
app.use(helmet())
app.use(cors())

app.use(function validateBearerToken(req, res, next) {
    const apiToken = process.env.API_TOKEN
    const authToken = req.get('Authorization')
    if (!authToken || authToken.split(' ')[1] !== apiToken) {
        return res.status(401).json({ error: 'Unauthorized request' })
    }
    // move to the next middleware
    next()
})

function handleGetMovie(req, res) {
    const { genre, country, avg_vote } = req.query;
    let results = MOVIES;
    console.log( { genre }, { country }, { avg_vote } );

    if(genre) {
        results = results.filter(movie => 
            // case insensitive searching
            movie.genre.toLowerCase().includes(genre.toLowerCase())
        )
    }

    if(country) {
        results = results.filter(movie => 
            // case insensitive searching
            movie.country.toLowerCase().includes(country.toLowerCase())
        )
    }

    if(avg_vote) {
        results = results.filter(movie => 
            // case insensitive searching
            movie.avg_vote >= avg_vote
        )
    }

    res.json(results);
}

app.get('/movie', handleGetMovie)

const PORT = 8000

app.listen(PORT, () => {
    console.log(`Server listening at https://localhost:${PORT}`)
})