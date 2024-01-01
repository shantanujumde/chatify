import type {
  FieldErrors,
  FieldValues,
  Path,
  UseFormRegister,
} from "react-hook-form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

function HooksInput<TReview extends FieldValues>({
  register,
  name,
  errors,
  label,
  isRequired = false,
  ...props
}: HooksInputProps<TReview>) {
  const isError = errors && errors[name];

  return (
    <div className="">
      <label htmlFor={name} className="">
        {label}
        {isRequired && <span className="text-red-600">*</span>}
      </label>

      {props.field === "input" ? (
        <Input
          className={isError ? "border-red-600" : ""}
          id={name}
          {...props}
          {...register(name, { required: isRequired })}
        />
      ) : (
        <Textarea
          className={isError ? "border-red-600" : ""}
          id={name}
          {...props}
          {...register(name, { required: isRequired })}
        />
      )}
      {isError && (
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        <div className="error body-text-small">{errors[name].message}</div>
      )}
    </div>
  );
}

export default HooksInput;

export type HooksInputProps<TReview extends FieldValues> =
  HooksInputPropsSharable<TReview> & {
    register: UseFormRegister<TReview>;
    errors?: FieldErrors<TReview>;
  };

export type HooksInputPropsSharable<TReview> = (
  | ({
      field: "input";
    } & React.DetailedHTMLProps<
      React.InputHTMLAttributes<HTMLInputElement>,
      HTMLInputElement
    >)
  | ({
      field: "textarea";
    } & React.DetailedHTMLProps<
      React.TextareaHTMLAttributes<HTMLTextAreaElement>,
      HTMLTextAreaElement
    >)
) & {
  label: string;
  name: Path<TReview>;
  placeholder?: string;
  isRequired?: boolean;
};
