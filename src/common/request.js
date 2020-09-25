const Get = (uri, header) => {
  return fetch(uri, {
    method: 'GET',
    headers: header,
  })
    .then((response) => response.json())
    .then((json) => {
      return json.movies;
    })
    .catch((error) => {
      console.error(error);
    });
};

export {Get};
