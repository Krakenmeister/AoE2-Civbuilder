function home () {
	if (getCookie("loginToken")) {
		axios.post('https://krakenmeister.com/michigaigo/login', {token: getCookie("loginToken")})
				.then(res => {
					window.location.href = "https://krakenmeister.com/michigaigo/play";
				})
				.catch(err => {
					console.log(err);
				});
		return;
	}

	removeAllChildNodes(document.getElementById("wrapper"));
	wrapper.innerHTML = `
		<div class="homepage" id="title">Michigai Go</div>
		<div class="homepage" id="optionsWrapper">
			<div class="homepage btn" id="guestPlay">Play as Guest</div>
			<div class="homepage btn" id="registerBtn">Create Account</div>
			<div class="homepage btn" id="loginBtn">Login</div>
		</div>
	`;

	document.getElementById("guestPlay").addEventListener("click", () => {
		window.location.href = "https://krakenmeister.com/michigaigo/play";
	});

	document.getElementById("registerBtn").addEventListener("click", () => {
		register();
	});

	document.getElementById("loginBtn").addEventListener("click", () => {
		login();
	});
}

function register () {
	removeAllChildNodes(document.getElementById("wrapper"));
	wrapper.innerHTML = `
		<div class="homepage" id="registerWrapper">
			<div class="inputWrapper" id="usernameWrapper">
				<div class="inputLabel" id="usernameLabel">Username:</div>
				<input type="text" id="username" name="username">
			</div>
			<div class="inputWrapper" id="passwordWrapper">
				<div class="inputLabel" id="passwordLabel">Password:</div>
				<input type="password" id="password" name="password">
			</div>
			<div class="homepage btn" id="registerSubmit">Register</div>
			<div class="homepage btn" id="goHome">Back</div>
		</div>
	`;

	document.getElementById("registerSubmit").addEventListener("click", () => {
		axios.post('https://krakenmeister.com/michigaigo/register',
			{username: document.getElementById("username").value,
			password: document.getElementById("password").value})
				.then(res => {
					if (res.data.success) {
						window.location.href = "https://krakenmeister.com/michigaigo/play";
					} else {
						alert("That username is already taken.");
					}
				})
				.catch(err => {
					console.log(err);
				});
	});

	document.getElementById("goHome").addEventListener("click", () => {
		home();
	});
}

function login () {
	removeAllChildNodes(document.getElementById("wrapper"));
	wrapper.innerHTML = `
		<div class="homepage" id="loginWrapper">
			<div class="inputWrapper" id="usernameWrapper">
				<div class="inputLabel" id="usernameLabel">Username:</div>
				<input type="text" id="username" name="username">
			</div>
			<div class="inputWrapper" id="passwordWrapper">
				<div class="inputLabel" id="passwordLabel">Password:</div>
				<input type="password" id="password" name="password">
			</div>
			<div class="homepage btn" id="loginSubmit">Login</div>
			<div class="homepage btn" id="goHome">Back</div>
		</div>
	`;

	document.getElementById("loginSubmit").addEventListener("click", () => {
		axios.post('https://krakenmeister.com/michigaigo/login',
			{username: document.getElementById("username").value,
			password: document.getElementById("password").value})
				.then(res => {
					if (res.data.success) {
						window.location.href = "https://krakenmeister.com/michigaigo/play";
					} else {
						alert("Username or password is incorrect.");
					}
				})
				.catch(err => {
					console.log(err);
				});
	});

	document.getElementById("goHome").addEventListener("click", () => {
		home();
	});

}

home();
