import { useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";

type IdForm = { id: string };
type User = { id: string; name: string; email: string };

export default function FindUser() {
  const { register, handleSubmit } = useForm<IdForm>();
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const onSubmit = async ({ id }: IdForm) => {
    setLoading(true);
    setUser(null);
    setError(null);
    setSuccessMessage(null);

    try {
      const res = await axios.get(`http://localhost:3000/users/${id}`);

      setUser(res.data);
      setSuccessMessage("User found successfully.");
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
      <div style={{ padding: "2rem" }}>
        <h1>Find User by ID</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="inline-id-group">
            <input {...register("id")} placeholder="User ID" required />
            <button type="submit" disabled={loading}>
              {loading ? "Searching..." : "Find"}
            </button>
          </div>
        </form>

        {error && <p style={{ color: "red" }}>{error}</p>}
        {successMessage && (
          <p style={{ marginTop: "1rem", color: "green" }}>{successMessage}</p>
        )}
        {user && (
          <div style={{ marginTop: "1rem" }}>
            <p>
              <strong>Name:</strong> {user.name}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
