const querystring = require('querystring');
var url = require('url');
var express = require('express');
var compression = require('compression')
var bodyParser = require('body-parser')
var rp = require('request-promise')

var app = express();
app.use(compression())
// app.use(compression({filter: shouldCompress}))
app.use(bodyParser.json())
app.use(bodyParser.text({ type: 'text/html' }))

function shouldCompress (req, res) {
  if (req.headers['x-no-compression']) {
    // don't compress responses with this request header
    return false
  }

  // fallback to standard filter function
  return compression.filter(req, res)
}

app.get('/boxscoresummary', async function(req, res){
  // 'https://stats.nba.com/stats/boxscoresummaryv2'

  var url_parts = url.parse(req.url, true);
  var query = url_parts.query;
  // const finalQs = querystring.stringify(query)
  var options = {
    uri: 'https://stats.nba.com/stats/boxscoresummaryv2',
    qs: query,
    headers: {
      'Host': 'stats.nba.com',
      'Connection': 'keep-alive',
      'Accept-Encoding': 'deflate, br',
      'Accept': 'application/json',
      // 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36',
    },
    json: true // Automatically parses the JSON string in the response
  };
  try {
    const finalRes = await rp(options)
    console.log({finalRes})
    res.send(finalRes)
  } catch (e) {
    console.error(e)
    throw e
  }
});


app.get('/boxscore', async function(req, res){
  // 'https://stats.nba.com/stats/boxscoresummaryv2'

  var url_parts = url.parse(req.url, true);
  var query = url_parts.query;
  // const finalQs = querystring.stringify(query)
  var options = {
    uri: 'https://stats.nba.com/stats/boxscoretraditionalv2',
    qs: {
      ...query,
     'EndPeriod': '10',
     'EndRange': '28800',
     'RangeType': '0',
     'Season': '2018-19',
     'StartPeriod': '1',
     'StartRange': '0'
    },
    headers: {
      'Host': 'stats.nba.com',
      'Connection': 'keep-alive',
      'Accept-Encoding': 'deflate, br',
      'Accept': 'application/json',
      // 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36',
    },
    json: true // Automatically parses the JSON string in the response
  };
  try {
    const finalRes = await rp(options)
    console.log({finalRes})
    res.send(finalRes)
  } catch (e) {
    console.error(e)
    throw e
  }
});

app.listen(8665, process.env.HOST || '127.0.0.1');
