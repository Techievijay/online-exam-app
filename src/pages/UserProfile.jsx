import { useSelector, useDispatch } from "react-redux";
import { fetchUserRequest } from "../redux/slices/userSlice";

const UserProfile = () => {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.user);

  return (
    <div>
      <button onClick={() => dispatch(fetchUserRequest(1))}>Fetch User</button>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {data && <p>Name: {data.name}</p>}
    </div>
  );
};

export default UserProfile;
