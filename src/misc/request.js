export function request(method, url, data, headers = {}) {

  const config = {method};
  config.headers = Object.assign({'content-type': 'application/json'}, headers);

  if ( ! url.startsWith('http')) {
    url = `/${url.startsWith('/') ? url.slice(1) : url}`;
  }

  if (method.toUpperCase() === 'GET') {
    const params = new URLSearchParams(data).toString();
    params && (url += `${url.includes('&') ? '&' : '?'}${params}`);
  } else {
    config.body = JSON.stringify(data || {});
  }

  function respond(res) {
    return new Promise((resolve, reject) => {
      res.text().then(body => {
        const data = JSON.parse(body || null);
        res.ok ? resolve(data) : reject({errors: data, status: res.status});
      })
    });
  }

  return fetch(url, config).then(respond);
};

['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].forEach(method => {
  request[method.toLocaleLowerCase()] = (...args) => request(method, ...args);
});
