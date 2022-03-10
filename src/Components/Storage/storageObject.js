export const storageObject = (type, data) => {
  let obj = {
    [type]: {
      city: data[type].city,
      email: data[type].email,
      img: data[type].img,
      name: data[type].name,
      phone: data[type].phone,
      _id: data[type]._id,
    },
    token: data.token,
    type: type,
  };

  if (type === "sub") obj[type].grade = data[type].grade;

  return obj;
};
