import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { api } from "~/utils/api";

const Profile = ({}) => {
  const { data: sessionData } = useSession();
  const router = useRouter();
  const { id } = router.query;
  const { isLoading, data: user } = api.profile.getUserProfile.useQuery(
    { id: String(id) },
    { enabled: sessionData?.user !== undefined }
  );

  if (!user) return <div className="text-grey-300">Please login to access</div>;
  if (isLoading) return <div className="text-grey-300">Loading...</div>;

  return (
    <div>
      <h2>Welcome {user.name}</h2>
      <p>Email: {user.email}</p>
    </div>
  );
};

export default Profile;
