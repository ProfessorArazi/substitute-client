import axios from "axios";

export const httpRequest = async (
  method = "get",
  url,
  data = {},
  headers = {}
) => {
  let response = await axios({
    method,
    url: `${process.env.REACT_APP_SERVER}${url}`,
    data,
    headers,
  })
    .then((res) => {
      return { data: res.data };
    })
    .catch((err) => {
      return { err: err };
    });

  return response;
};
