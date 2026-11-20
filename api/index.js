const handleRequest = require("../server").handleVercelRequest;

module.exports = (request, response) => {
  const url = new URL(request.url, "http://localhost");
  const apiPath = url.searchParams.get("__vapi_path");

  if (url.pathname === "/api/index" && apiPath) {
    url.searchParams.delete("__vapi_path");
    url.pathname = `/api/${apiPath}`;
    request.url = `${url.pathname}${url.search}`;
  }

  return handleRequest(request, response);
};