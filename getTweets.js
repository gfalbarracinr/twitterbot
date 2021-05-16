const Twit = require('twit');
const config = require('./config.js')
const T = new Twit(config);
const fs = require('fs');

T.get('account/verify_credentials',  {
    include_entities: false,
    skip_status: true,
    include_email: false
}, onAuthenticated);

function onAuthenticated(err) {
    if (err) {
        console.log(err);
    } else {
        console.log('Authentication succesful.');
    }

    let stream = T.stream('statuses/filter', {
        track:'@iEpaOficial',
        tweet_mode: 'extended'
    });

    getTweets('iEpaOficial');
}

function getTweets(user) {
    T.get('statuses/user_timeline', {
        screen_name: user,
        include_rts: false,
        exclude_replies: true,
        count: 200
    }, function(err, response) {
        if (err) {
            console.log(err);
        } else {
            console.log(response);
            saveToFile(response);
        }
    })
}

function saveToFile(response) {
    
    const tweets = response.map((tweet) => {
        text = tweet.text;
        if (text.indexOf('http') === -1){
            return text;
        }
        
    });
    const sanitizedTweets = tweets.filter(tweet => tweet);
    const json = JSON.stringify(sanitizedTweets, null, 2)
    fs.writeFile('input.json', json, (err) => {
        if(err) {
            throw err;
        }
        console.log('Data has been written to file succesfully.');
    })    
}