import JQuery from 'jquery';
export default function sendRequest({ apiURL, access, endpoint, query, body, method = `GET`, authorize = true }){
  let fullURL = apiURL + endpoint;

  if (query){
    fullURL = urlWithParams(fullURL, query);
  }
  
  const headers = {};

  if (body) {
    headers[`Accept`] = `application/json`;
    headers[`Content-Type`] = `application/json`;
  }

  if (authorize) {
    headers.Authorization = `Bearer ${access}`;
  }

  return jQuery.ajax({
    url : fullURL,
    method,
    headers,
    data : JSON.stringify(body),
    success : (result) => {
      return result;
    }
  })

  // return fetch(fullURL, params)
  //   .then(response => response.text().then(text => ({ json : text ? JSON.parse(text) : {}, response })))
  //   .then(({ json, response }) => {
  //     if (!response.ok){
  //       return Promise.reject(json);
  //     }
  //     return json;
  //   });
}

export function urlWithParams(urlString, params = {}){
  const url = new URL(urlString);
  const searchParams = new URLSearchParams();
  Object.keys(params).forEach(key => {
    searchParams.append(key, encodeURI(params[key]));
  });
  url.search = searchParams.toString();
  return url.toString();
}