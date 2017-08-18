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
    done : (result) => {
      return result;
    }
  })
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