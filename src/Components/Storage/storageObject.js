export const storageObject = (type, data) => {
  let obj = {
    [type]: {
      _id: data[type]._id,
      city: data[type].city,
      email: data[type].email,
      img: data[type].img,
      name: data[type].name,
      phone: data[type].phone,
      mailingList: data[type].mailingList,
    },
    token: data.token,
    type: type,
  };

  if (type === "sub") {
    obj[type].grade = data[type].grade;
    obj[type].desc = data[type].desc;
  } else {
    obj[type].ageGroup = data[type].ageGroup;
  }

  return obj;
};
