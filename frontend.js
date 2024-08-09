apiUrl = "http://localhost:80/api"

async function request(data) {
    var response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    }).catch(() => {
        console.error("Request failed.")
        return undefined
    })

    if (response) {
        response = await response.json()
        console.log(response)
        return response.response;
    }
}