import { Work } from "../Pages/Work";

export const WorksFormat = (props) => {
  const { works, title } = props;
  return (
    <>
      <h2>{title}</h2>
      <div className="works">
        {works.map((work, i) => (
          <Work
            key={work._id}
            id={work._id}
            work={work}
            type={props.type}
            page="works"
            date={work.date}
            subject={work.subject}
            hours={work.hours}
            ageGroup={work.ageGroup}
            applied={work.applied}
            picked={work.taken ? true : false}
            onDelete={
              props.onDelete ? (userId, id) => props.onDelete(userId, id) : ""
            }
            onEdit={(work) => (props.onEdit(work) ? props.onEdit : "")}
          />
        ))}
      </div>
    </>
  );
};
