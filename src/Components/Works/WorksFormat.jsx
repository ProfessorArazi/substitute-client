import { Work } from "../../Components/Works/Work";
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
              city={work.city}
              work={work}
              type={props.type}
              page="works"
              date={work.date}
              subject={work.subject}
              school={work.school}
              ageGroup={work.ageGroup}
              hours={work.hours}
              applied={work.applied}
              old={now > new Date(work.date).getTime()}
              grade={work.grade ? work.grade : false}
              phone={props.close && work.phone}
              picked={
                work.taken._id && props.type === "school" ? work.taken : false
              }
              onDelete={
                props.onDelete ? (userId, id) => props.onDelete(userId, id) : ""
              }
              onEdit={(work) => (props.onEdit(work) ? props.onEdit : "")}
              onCancel={props.onCancel && props.onCancel}
            />
          </CSSTransition>
        ))}
      </TransitionGroup>
    </>
  );
};
