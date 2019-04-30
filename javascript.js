//Media query
//fix lat and long weird glitch at big size

//check for strings

//find out what mvvm framework is

//validate html and css


const app = new Vue({
            el: '#app',
            data: {
                title: "Project 4",
                result: "loading",
                geoResult: "loading",
                currentLat: '43.1566',
                currentLong: '77.6088',
                Askey: "a54c0fb6b7947c6785acbbd4327d5dd437f87cc9",
                AsID: "dfedcd9c-19ac-4511-8be7-94fcbae1db09",
                AsDomain: "https://people.rit.edu",
                token: "",
                database: ""
            },
            created() {
                //this.search()
                // Initialize Firebase
                var config = {
                    apiKey: "AIzaSyAibUl8D6kTXGhxO8xcCocygjRbyo712Wk",
                    authDomain: "starfinder-7daeb.firebaseapp.com",
                    databaseURL: "https://starfinder-7daeb.firebaseio.com",
                    projectId: "starfinder-7daeb",
                    storageBucket: "starfinder-7daeb.appspot.com",
                    messagingSenderId: "252674911376"
                };
                firebase.initializeApp(config);

                console.log(firebase); // verify that firebase is loaded by logging the global it created for us

                // #1 - get a reference to the databse
                this.database = firebase.database();

                // #2 - refer to a root node named `scores`
                let ref = this.database.ref('scores');



                // #3 - create some data
                let data = {
                    inputLat: '43.1566',
                    inputLong: '77.6088'
                };

                // #4 - send data, in this case we are adding it to the `scores` node
                ref.push(data);
            },
            methods: {
                search() {
                    //console.log(limit);
                    //if (! this.term.trim()) return;
                    //https://cors-anywhere.herokuapp.com/api.openweathermap.org/data/2.5/find?q=London&appid=5e16c543219fc585e74c6275f9450fa5
                    let url = "https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/605bcd829d90fb8c0a272b66244388e7/" + this.currentLat + "," + this.currentLong;
                    console.log(url);
                    fetch(url)
                        .then(response => {
                            if (!response.ok) {
                                throw Error(`ERROR: ${response.statusText}`);
                            }
                            return response.json();
                        })
                        .then(json => {
                            //console.log(json);
                            this.result = json;
                            console.log(this.result.currently.temperature);
                        })
                }, // end search
                astronomySearch() {
                    let url = "https://api.astronomyapi.org/auth?app_id=" + this.AsID + "&app_secret=" + this.Askey;
                    console.log(url);
                    fetch(url, {
                            headers: {
                                "origin": "https://people.rit.edu"
                            }
                        })
                        .then(response => {
                            if (!response.ok) {
                                throw Error(`ERROR: ${response.statusText}`);
                            }
                            return response.json();
                        })
                        .then(json => {
                            //console.log(json);
                            this.token = json.token;
                            this.astronomyPull();
                        })
                },
                astronomyPull() {
                    let url = "https://api.astronomyapi.org/";
                    console.log(url);
                    fetch(url, {
                            headers: {
                                "Authorization": "Bearer " + this.token,
                                'X-Requested-With': 'XMLHttpRequest'
                            }
                        })
                        .then(response => {
                            if (!response.ok) {
                                throw Error(`ERROR: ${response.statusText}`);
                            }
                            return response.json();
                        })
                        .then(json => {
                            //console.log(json);
                            this.geoResult = json;
                            console.log(JSON.stringify(json));
                        })
                },
                geoLocation() {
                    let ref = this.database.ref('geoLocations');
                    let url = "https://api.ipgeolocation.io/astronomy?apiKey=99a7a2ef78ff4e2193dda6c3bd1af8c5&lat=" + this.currentLat + "&long=" + this.currentLong;
                    console.log(url);
                    fetch(url)
                        .then(response => {
                            if (!response.ok) {
                                throw Error(`ERROR: ${response.statusText}`);
                            }
                            return response.json();
                        })
                        .then(json => {
                            //console.log(json);
                            this.geoResult = json;

                            console.log(JSON.stringify(json));
                            console.log(this.geoResult.sun_distance);
                            console.log(this.geoResult.moon_distance);

                            ref.push(this.geoResult);
                            //console.log(this.result.currently.temperature);
                        })
                } //end of search
            } // end methods
        });


$("#load").hide();

$(".btn").click(function() {
    $("#load").show();
    $("#allResults").ready(function() {
        $("#allResults").show();
        $("#load").hide();
    });
})
