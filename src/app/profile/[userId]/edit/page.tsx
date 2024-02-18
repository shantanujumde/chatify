"use client";
import HooksInput, {
  type HooksInputPropsSharable,
} from "@/components/HooksInput";
import { Button } from "@/components/ui/button";
import { api } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";

const EditProfile = ({}) => {
  const EditProfileSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    // image: z.string().min(1, "Invalid image"),
  });

  const { data: sessionData, status } = useSession({
    required: true,
  });

  const userId = sessionData?.user?.id;

  const { data: userProfile } = api.profile.getUser.useQuery(
    { id: userId! },
    { enabled: status === "authenticated" }
  );

  const { mutate: updateUserProfile } = api.profile.updateUser.useMutation();

  type EditFormType = z.infer<typeof EditProfileSchema>;

  const fields: HooksInputPropsSharable<EditFormType>[] = [
    {
      label: "Name (first and last name)",
      name: "name",
      field: "input",
      type: "text",
      placeholder: "e.g. John Doe",
      defaultValue: userProfile?.user?.name ?? "",
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
    updateUserProfile(data);
  };

  return (
    <main>
      <h1 className="text-3xl font-bold">Edit Profile</h1>
      <form
        className="mt-4 flex flex-col gap-4"
        onSubmit={(event) => void handleSubmit(onSubmit)(event)}
      >
        {fields.map((field) => (
          <HooksInput<EditFormType>
            key={field.name}
            {...field}
            register={register}
            errors={errors}
            labelProps={{
              className: "text-md uppercase font-medium",
            }}
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
