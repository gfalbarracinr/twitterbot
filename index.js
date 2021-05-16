const Twit = require('twit');
const config = require('./config.js');
const fs = require('fs');


const T = new Twit(config);

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
        track:'@epacolombiabot',
        tweet_mode: 'extended'
    });

    stream.on('tweet', monitoringTweets);
}

function isTweetExactMatch(text) {
    text = text.toLowerCase()
    return text.includes('@epacolombiabot')
}

function monitoringTweets(tweet) {
    console.log(tweet.text);
    if(!tweet.retweeted_status && tweet.user.screen_name !== 'epacolombiabot' && isTweetExactMatch(tweet.text)){        
        sendReply(tweet);
    }        
}

function random_item(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function getMessage() {
    let rawdata = fs.readFileSync('input.json');
    let tweets = JSON.parse(rawdata);
    return random_item(tweets);
}

function sendReply(tweet) {
    const account = tweet.user.screen_name;
    const responseMessage = getMessage(); 
    const response = `@${account} ${responseMessage}`;
    T.post('statuses/update', {
        in_reply_to_status_id: tweet.id_str,
        status: response
    }, onTweeted)
}

function onTweeted(err) {
    if (err) {
        console.log(err);
    } else {
        console.log('It has replied to a tweet.');
    }
}