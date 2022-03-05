import { useContext } from "react";
import WorksContext from "./store/works-context";

export const SetSchoolInStorage = (props) => {
  return console.log(props);
  const ctx = useContext(WorksContext);
  const { updateUserWorks } = ctx;

  sessionStorage.setItem("user", JSON.stringify(props.data));
  updateUserWorks({ works: props.data.school.works });
};
