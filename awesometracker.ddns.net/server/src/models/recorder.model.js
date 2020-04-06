class Recorder {

	static insertApiCall(appCode, url, method) {

		return `insert into apiCalls values (0, '${appCode}', '${url}', '${method}', current_timestamp())`;

	}

	static insertAppCall(url, method) {

		return `insert into appCalls values (0, '${url}', '${method}', current_timestamp())`;

	}

}

module.exports = Recorder; 