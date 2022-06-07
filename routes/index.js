var express = require('express');
const { YOUTUBE_DATA } = require('../data');
var router = express.Router();
const { v4: uuidv4 } = require('uuid');

/***
 * TokenDetails {
 *  start,
 *  end
 * }
 */

const getResponse = (token, resultCount) => {
  return {
    "kind": "youtube#searchListResponse",
    "etag": "q8hQeFYm-7QxCUh5W6iUn-e2lZI",
    "nextPageToken": token,
    "regionCode": "IN",
    "pageInfo": {
      "totalResults": YOUTUBE_DATA.length,
      "resultsPerPage": resultCount
    },
    "items": []
  }
}

router.get('/youtube/v3/search', async function (req, res) {
  const { maxResults = 5, nextPageToken, prevPageToken } = req.query;
  const response = getResponse(nextPageToken, maxResults);
  let start = 0;
  let end = parseInt(maxResults);
  let max = end < 50 ? end : 50;
  let _token = nextPageToken || prevPageToken;
  if (_token) {
    const tokenString = await global.db.get(_token);
    const token = JSON.parse(tokenString);
    console.log(token);
    if (nextPageToken) {
      start = token.end;
      end = token.end + max;
    } else {
      start = token.start - max;
      end = token.start;
    }
  } else {
    [_token] = uuidv4().split('-');
    global.db.set(_token + ':usage', 0);
  }
  if (start >= 0) {
    response.items = YOUTUBE_DATA.slice(start, end);
    global.db.set(_token, JSON.stringify({ start, end }));
  }
  res.json({ ...response, pageToken: _token });
  global.db.incr(_token + ':usage', 0);
  global.db.incr('/youtube/v3/search');
});

router.get('/api/user/:userid', (req, res) => {
  const userId = req.params.userid;
  if (userId === 'rahulnjs') {
    const user = {
      "firstName": "Rahul",
      "lastName": "Sharma",
      "gender": "man",
      "age": 24,
      "address": {
        "streetAddress": "126",
        "city": "San Jone",
        "state": "CA",
        "postalCode": "394221"
      },
      "phone": [
        { "type": "home", "number": "7383627627" }
      ]
    };
    if (req.query.include) {
      const parts = req.query.include.split(/\s?,\s?/);
      if (parts.length <= 1) {
        if (parts[0] === 'address') {
          delete user.phone;
        } else {
          delete user.address;
        }
      }
    } else {
      delete user.address;
      delete user.phone;
    }

    res.json(user);
  } else {
    res.status = 404;
    res.json({ err: 'Not found' });
  }

});

module.exports = router;
