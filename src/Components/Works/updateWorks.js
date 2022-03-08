import { httpRequest } from "../../httpRequest";

export const updateWorks = async (url) => {
  const user = JSON.parse(sessionStorage.getItem("user"));

  const res = await httpRequest(
    "post",
    url,
    {
      substituteId: user.sub._id,
      email: user.sub.email,
      type: user.type,
    },
    { token: user.token }
  );

  return res;
};
