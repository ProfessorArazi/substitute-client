import React, { forwardRef } from "react";
import { Form } from "react-bootstrap";

export const Input = forwardRef((props, ref) => {
  return (
    <>
      <Form.Label className="form-label">{props.label}</Form.Label>
      <Form.Group className="mb-3" controlId={props.name}>
        {props.type === "textarea" ? (
          <Form.Control
            className={`form-input ${
              props.errors && props.errors[props.name] && "is-invalid"
            }`}
            ref={ref}
            as={props.type}
            rows={3}
            placeholder={props.placeholder}
          />
        ) : (
          <Form.Control
            className={`form-input ${
              props.errors && props.errors[props.name] && "is-invalid"
            }`}
            onInput={props.onInput && props.onInput}
            onChange={props.onChange && props.onChange}
            ref={ref}
            type={props.type}
            dir={props.dir && props.dir}
            value={props.value && props.value}
            placeholder={props.placeholder ? props.placeholder : ""}
          />
        )}
      </Form.Group>
    </>
  );
});
