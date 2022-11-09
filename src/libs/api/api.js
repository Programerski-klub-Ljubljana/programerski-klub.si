const instance = axios.create({
    baseURL: 'https://example.com/api/',
    timeout: 1000,
    headers: {'Authorization': 'Bearer '+token}
});

instance.get('/path')
    .then(response => {
        return response.data;
    })
