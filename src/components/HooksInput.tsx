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
  labelProps,
  ...props
}: HooksInputProps<TReview>) {
  const isError = errors && errors[name];

  return (
    <>
      <label htmlFor={name} {...labelProps}>
        {label}
        {isRequired && <span className="text-red-400">*</span>}
      </label>

      {props.field === "input" ? (
        <Input
          className={isError ? "border-red-400" : ""}
          id={name}
          {...props}
          {...register(name, { required: isRequired })}
        />
      ) : (
        <Textarea
          className={isError ? "border-red-400" : ""}
          id={name}
          {...props}
          {...register(name, { required: isRequired })}
        />
      )}
      {isError && (
        <div className="text-sm font-semibold text-red-400">
          {String(errors[name]?.message)}
        </div>
      )}
    </>
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
  labelProps?: React.LabelHTMLAttributes<HTMLLabelElement>;
};
