"use client";
import HooksInput, {
  type HooksInputPropsSharable,
} from "@/components/HooksInput";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";

const EditProfile = ({}) => {
  const EditProfileSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    // image: z.string().min(1, "Invalid image"),
  });

  type EditFormType = z.infer<typeof EditProfileSchema>;

  const fields: HooksInputPropsSharable<EditFormType>[] = [
    {
      label: "Name",
      name: "name",
      field: "input",
      type: "text",
    },
  ];

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<EditFormType>({
    resolver: zodResolver(EditProfileSchema),
    mode: "onBlur",
  });

  const onSubmit: SubmitHandler<EditFormType> = (data) => {
    console.log(data);
  };

  return (
    <main>
      <form
        className="flex flex-col gap-4"
        onSubmit={(event) => void handleSubmit(onSubmit)(event)}
      >
        {fields.map((field) => (
          <HooksInput<EditFormType>
            key={field.name}
            {...field}
            register={register}
            errors={errors}
          />
        ))}
        <Button type="submit" disabled={!isValid}>
          Update
        </Button>
      </form>
    </main>
  );
};

export default EditProfile;
