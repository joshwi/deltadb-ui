var axios = require('axios');

const POSTY = async function(url, body, headers={'Content-Type': 'application/json','Access-Control-Allow-Origin': '*'}){

    // let token = localStorage.getItem("api_key")
    // headers['Authorization'] = `Bearer ${token}`

    let output = await axios({
        url: url,
        method: 'POST',
        headers: headers,
        data : JSON.stringify(body)
      })
    .then(function (response) {return response.data})
    .catch(function (error) { console.log(error); return "" });

    return output
    
}

const POST = async function(url, body, headers={'Content-Type': 'application/json','Access-Control-Allow-Origin': '*'}){

    let output = await axios({
        url: url,
        method: 'POST',
        headers: headers,
        data : JSON.stringify(body)
      })
    .then(function (response) {return response.data})
    .catch(function (error) { console.log(error); return "" });

    return output
    
}

const get = async function(url){
    let headers = new Headers()
    let token = localStorage.getItem("api_key")
    headers.set('Accept', 'application/json')
    headers.set('Content-Type', 'application/json')
    headers.set('Access-Control-Allow-Origin', '*')
    headers.set('Authorization', `Bearer ${token}`)
    if(url){
        let response = await fetch(url, {
            method: "GET",
            headers: headers,
        }).catch((error) => {
            throw error;
        });
        let data = await response.json()
        return data
    }
}

const post = async function(url, body){
    let headers = new Headers()
    let token = localStorage.getItem("api_key")
    headers.set('Accept', 'application/json')
    headers.set('Content-Type', 'application/json')
    headers.set('Access-Control-Allow-Origin', '*')
    headers.set('Authorization', `Bearer ${token}`)
    if(url){
        let response = await fetch(url, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(body),
        }).catch((error) => {
            throw error;
        });
        let data = await response.json()
        return data
    }
}

export {get, post, POST, POSTY}