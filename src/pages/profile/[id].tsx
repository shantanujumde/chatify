import { api } from "@/utils/api";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

const Profile = ({}) => {
  const router = useRouter();

  const { data: sessionData, status } = useSession({
    required: true,
    async onUnauthenticated() {
      await router.push("/auth/login");
    },
  });

  const { id } = router.query;
  const { isLoading, data: user } = api.profile.getUserProfile.useQuery(
    { id: String(id) },
    { enabled: sessionData?.user !== undefined }
  );

  if (status === "loading")
    return <div className=" text-gray-700">Loading...</div>;
  // if (isLoading) return <div className=" text-gray-700">Loading...</div>;
  console.log("isLoading", isLoading);

  if (!user)
    return <div className=" text-gray-700">Please login to access</div>;
  return (
    <div>
      <h2>Welcome {user.name}</h2>
      <p>Email: {user.email}</p>
      <br />
      <h2>User Data</h2>
      <p> {JSON.stringify(user).split(",").join("\n")}</p>
      <br />
      <h2>Session Data</h2>
      <p> {JSON.stringify(sessionData).split(",").join("\n")}</p>
    </div>
  );
};

export default Profile;
