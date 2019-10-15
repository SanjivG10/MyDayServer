
window.fbAsyncInit = function() {
    FB.init({
      appId            : '516541285794241',
      autoLogAppEvents : true,
      xfbml            : true,
      version          : 'v4.0'
    })
  }


const  clientID = "845226368257-rpep5duu3iam6rpg7f9deutbdf5nv0n4.apps.googleusercontent.com"
const client_secret = "_y-ftx7SI6XFqHV3vZLWoUO6"


document.querySelector('.facebook').onclick = (  (event)=>{
    
    FB.getLoginStatus(function(response) {
        if (response.status === 'connected') {
            FB.api(
                `/${response.authResponse.userID}/picture?redirect=0&type=large`,
                'GET',
                {},
                function(apiResponse) {
                    console.log(apiResponse)
                    response.authResponse.pic = apiResponse.data.url

                    // Insert your code here
                }
              );
            sendFetchRequest({
                success:true, 
                response
            })
        }

        else {
            FB.login(function(response) {
                if (response.status === 'connected') {

                    console.log("DEVICE CONNECTED COOL!")

                    const whatResponse = {
                        success:true, 
                        response
                    }

                    FB.api(
                        `/${response.authResponse.userID}/picture?redirect=0&type=large`,
                        'GET',
                        {},
                        function(apiResponse) {
                            response.authResponse.pic = apiResponse.data.url
                            // Insert your code here
                        }
                      );

                    console.log("SENDING THIS ",whatResponse)
                    sendFetchRequest(whatResponse)
                } 
                else if (response.status ==='not_authorized'){

                    console.log("DEVICE NOT AUTHORIZED CONNECTED COOL!")
                    const response = {
                        success:false, 
                        response:"User is logged in, but not authorized"
                    }
                    sendFetchRequest(response)
                }
                else {

                        const response = {
                            success:false, 
                            response:"User is not logged in"
                        }
                        sendFetchRequest(response)
                    }
                }, {scope: ['email','user_photos']})
            }
        
            })

        
    })

function sendFetchRequest(response)
{
    console.log("THIS IS WHAT I AM SENING ",response)
    fetch('https://localhost:3000/login/facebook', {
        method: "POST",
        body: JSON.stringify(response),
        headers: {
            "Content-Type": "application/json"
        },      
    }).then(function(response) {
        console.log(response)
        // handle HTTP response
    }, function(error) {
        console.log(error)
        // handle network error
    })
}






document.querySelector('.g-signin2').onclick = (event)=>{


    // gapi.load('auth2', function() {
    //     const gAuth = gapi.auth2.init({
    //         client_id: '845226368257-rpep5duu3iam6rpg7f9deutbdf5nv0n4.apps.googleusercontent.com'
    //     })

    //     gAuth.then(()=>{
    //         console.log(gAuth.currentUser.get())
    //     },(err)=>{
    //         console.log(err)
    //     })
    //     /* Ready. Make a call to gapi.auth2.init or some other API */
    //   });

}
function onSignIn(googleUser) {

    // console.log(googleUser.getAuthResponse().id_token)

    // const profile = googleUser.getBasicProfile();
    // console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    // console.log('Name: ' + profile.getName());
    // console.log('Image URL: ' + profile.getImageUrl());
    // console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
    // console.log(profile)
    


    // fetch('https://localhost:3000/login/google', {
    //     method: "POST", 
    //     headers: {
    //         "Content-Type": "application/json"
    //     },
    //     body: 
    //         JSON.stringify({
    //             response:{
    //                 googleID: profile.getId(), 
    //                 image: profile.getImageUrl(), 
    //                 id_token: googleUser.getAuthResponse().id_token, 
    //                 exp: "15584546489"
    //             }
    //         })
       
    //   }).then(function(response) {
    //     console.log(response)
    //     // handle HTTP response
    // }, function(error) {
    //     console.log(error)
    //     // handle network error
    // });

  }