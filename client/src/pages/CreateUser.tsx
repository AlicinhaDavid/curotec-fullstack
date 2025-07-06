import { useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";

type UserFormData = {
  name: string;
  email: string;
};

export default function CreateUser() {
  const { register, handleSubmit, reset } = useForm<UserFormData>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const onSubmit = async (data: UserFormData) => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await axios.post("http://localhost:3000/users", data);
      setSuccessMessage("User created successfully!");
      reset();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err?.response?.data?.message || "API error.");
      } else {
        setError("Unexpected error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div style={{ padding: "2rem", maxWidth: "400px" }}>
        <h1>Create User</h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div style={{ marginBottom: "1rem" }}>
            <label>Name: </label>
            <input {...register("name")} required />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label>Email: </label>
            <input {...register("email")} type="email" required />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>

        {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}
        {successMessage && (
          <p style={{ color: "green", marginTop: "1rem" }}>{successMessage}</p>
        )}
      </div>
    </div>
  );
}
