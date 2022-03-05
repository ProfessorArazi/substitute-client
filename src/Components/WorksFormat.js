import { Work } from "../Pages/Work";
import { CSSTransition, TransitionGroup } from "react-transition-group";

export const WorksFormat = (props) => {
  const { works, title } = props;
  const now = new Date().getTime();
  return (
    <>
      <h2>{title}</h2>

      <TransitionGroup component={"ul"} className="works">
        {works.map((work, i) => (
          <CSSTransition key={i} timeout={700} classNames="works-work">
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
              old={now > new Date(work.date).getTime()}
              grade={work.grade ? work.grade : false}
              picked={work.taken._id ? work.taken : false}
              onDelete={
                props.onDelete ? (userId, id) => props.onDelete(userId, id) : ""
              }
              onEdit={(work) => (props.onEdit(work) ? props.onEdit : "")}
            />
          </CSSTransition>
        ))}
      </TransitionGroup>
    </>
  );
};
