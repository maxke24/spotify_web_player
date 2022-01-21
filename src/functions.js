"use strict";

window.onSpotifyWebPlaybackSDKReady = () => {
	window.sdkReady = true;
};

let oauthSource, oauthTemplate, oauthPlaceholder;

let params = getHashParams();

let access_token = params.access_token,
	refresh_token = params.refresh_token,
	error = params.error;

document.addEventListener("DOMContentLoaded", init);

function init() {
	/**
	 * Obtains parameters from the hash of the URL
	 * @return Object
	 */

	/* let userProfileSource = document.getElementById(
			"user-profile-template"
		).innerHTML,
		userProfileTemplate = Handlebars.compile(userProfileSource),
		userProfilePlaceholder = document.getElementById("user-profile"); */

	(oauthSource = document.getElementById("oauth-template").innerHTML),
		(oauthTemplate = Handlebars.compile(oauthSource)),
		(oauthPlaceholder = document.getElementById("oauth"));

	let params = getHashParams();

	let access_token = params.access_token,
		refresh_token = params.refresh_token,
		error = params.error;

	if (error) {
		alert("There was an error during the authentication");
	} else {
		if (access_token) {
			// render oauth info
			oauthPlaceholder.innerHTML = oauthTemplate({
				access_token: access_token,
				refresh_token: refresh_token,
			});

			$.ajax({
				url: "https://api.spotify.com/v1/me",
				headers: {
					Authorization: "Bearer " + access_token,
				},
				success: function (response) {
					// userProfilePlaceholder.innerHTML =
					// 	userProfileTemplate(response);

					// $("#login").hide();
					$("#loggedin").show();
					teaseSDK(access_token);
					console.log("success");
				},
			});
		} else {
			// render initial screen
			$("#login").show();
			$("#loggedin").hide();
		}

		/* document.getElementById("obtain-new-token").addEventListener(
            "click",
            function () {
                $.ajax({
                    url: "/refresh_token",
                    data: {
                        refresh_token: refresh_token,
                    },
                }).done(function (data) {
                    access_token = data.access_token;
                    oauthPlaceholder.innerHTML = oauthTemplate({
                        access_token: access_token,
                        refresh_token: refresh_token,
                    });
                });
            },
            false
        ); */
	}
}

function getHashParams() {
	let hashParams = {};
	let e,
		r = /([^&;=]+)=?([^&;]*)/g,
		q = window.location.hash.substring(1);
	while ((e = r.exec(q))) {
		hashParams[e[1]] = decodeURIComponent(e[2]);
	}
	return hashParams;
}

const teaseSDK = (token) => {
	const foreplay = setInterval(() => {
		if (window.sdkReady) {
			const player = new Spotify.Player({
				name: "Web Playback SDK Quick Start Player",
				getOAuthToken: (cb) => {
					cb(token);
				},
				volume: 0.5,
			});

			smackSDK(player);

			clearInterval(foreplay);
		}
	}, 1000);
};

const smackSDK = (player) => {
	// Ready
	player.addListener("ready", ({ device_id }) => {
		console.log("Ready with Device ID", device_id);
	});

	// Not Ready
	player.addListener("not_ready", ({ device_id }) => {
		console.log("Device ID has gone offline", device_id);
	});

	player.addListener("initialization_error", ({ message }) => {
		console.error("1" + message);
	});

	player.addListener("authentication_error", ({ message }) => {
		console.error("2" + message);
	});

	player.addListener("account_error", ({ message }) => {
		console.error("3" + message);
	});

	player.addListener("playback_error", ({ message }) => {
		console.error("5" + message);
	});

	document.querySelector("#togglePlay").addEventListener("click", (e) => {
		e.target.preventDefault;
		console.log("4");
		player.togglePlay();
		document.querySelector("#togglePlay").classList.toggle("pause");
	});

	/* player.addListener(
		"player_state_changed",
		({ position, duration, track_window: { current_track } }) => {
			console.log("Currently Playing", current_track.name);
			console.log("Position in Song", position);
			console.log("Duration of Song", duration);
			oauthPlaceholder.innerHTML = oauthTemplate({
				title: current_track.name,
			});
		}
	); */

	player.connect();
};
