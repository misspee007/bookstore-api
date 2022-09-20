// parser
function parseBody(body) {
	// concatenate raw data into a single buffer string
	const parsedBody = Buffer.concat(body).toString();
  // handle error
  if (!parsedBody) {
    return false;
  }
	// parse the buffer string into a JSON object
	return JSON.parse(parsedBody);
}

module.exports = { parseBody };
