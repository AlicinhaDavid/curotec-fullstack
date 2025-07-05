import { useForm } from "react-hook-form";
import axios from "axios";

type UserFormData = {
  name: string;
  email: string;
};

function App() {
  const { register, handleSubmit, reset } = useForm<UserFormData>();

  const onSubmit = async (data: UserFormData) => {
    try {
      const response = await axios.post("http://localhost:3000/users", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Response:", response.data);
      alert("User created successfully!");
      reset();
    } catch (err) {
      alert("Something went wrong!");
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Create User</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Name: </label>
          <input {...register("name")} placeholder="Your name" required />
        </div>
        <div>
          <label>Email: </label>
          <input
            {...register("email")}
            type="email"
            placeholder="Your email"
            required
          />
        </div>
        <button type="submit" style={{ marginTop: "1rem" }}>
          Submit
        </button>
      </form>
    </div>
  );
}

export default App;
