import { useForm } from "react-hook-form";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import api, { isAxiosError } from "../api";
import { IdFormData, idSchema } from "../schemas/idSchema";
import { User } from "../types/User";

type UserFormData = User;

export default function FindUser() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IdFormData>({
    resolver: zodResolver(idSchema),
  });
  const [user, setUser] = useState<UserFormData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const onSubmit = async ({ id }: IdFormData) => {
    setLoading(true);
    setUser(null);
    setError(null);
    setSuccessMessage(null);

    try {
      const res = await api.get(`/users/${id}`);

      setUser(res.data);
      setSuccessMessage("User found successfully.");
    } catch (err: unknown) {
      if (isAxiosError(err)) {
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
            <input {...register("id")} placeholder="User ID" />
            <button type="submit" disabled={loading}>
              {loading ? "Searching..." : "Find"}
            </button>
            {errors.id && <p style={{ color: "red" }}>{errors.id.message}</p>}
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
